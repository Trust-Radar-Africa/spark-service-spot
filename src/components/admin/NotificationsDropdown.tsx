import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Bell, Users, Building2, Briefcase, FileText, Check, Trash2, X } from 'lucide-react';
import { useNotificationsStore, AdminNotification } from '@/stores/notificationsStore';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const iconMap = {
  candidate: Users,
  employer: Building2,
  job: Briefcase,
  blog: FileText,
};

const colorMap = {
  candidate: 'text-primary bg-primary/10',
  employer: 'text-blue-500 bg-blue-500/10',
  job: 'text-green-500 bg-green-500/10',
  blog: 'text-amber-500 bg-amber-500/10',
};

export default function NotificationsDropdown() {
  const { notifications, fetchNotifications, markAsRead, markAllAsRead, removeNotification, clearAll, getUnreadCount } =
    useNotificationsStore();
  const [open, setOpen] = useState(false);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = getUnreadCount();

  const handleNotificationClick = (notification: AdminNotification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    markAllAsRead();
                  }}
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[300px]">
              {notifications.map((notification) => {
                const Icon = iconMap[notification.type];
                return (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      'flex items-start gap-3 p-3 cursor-pointer',
                      !notification.read && 'bg-muted/50'
                    )}
                    asChild
                  >
                    <Link
                      to={notification.link || '#'}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className={cn('p-2 rounded-lg shrink-0', colorMap[notification.type])}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              'text-sm truncate',
                              !notification.read && 'font-medium'
                            )}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </ScrollArea>
            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-destructive hover:text-destructive"
                    onClick={() => clearAll()}
                  >
                    <Trash2 className="h-3 w-3 mr-2" />
                    Clear all notifications
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
