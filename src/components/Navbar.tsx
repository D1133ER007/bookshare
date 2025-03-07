import { Link } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { useUnreadCounts } from '@/hooks/useUnreadCounts';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from './NotificationDropdown';
import { MessageDropdown } from './MessageDropdown';
import { Bell, MessageSquare } from 'lucide-react';
import { Badge } from './ui/badge';

export function Navbar() {
  const { user } = useUser();
  const { unreadMessages, unreadNotifications } = useUnreadCounts();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          BookShare
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <NotificationDropdown>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadNotifications}
                      </Badge>
                    )}
                  </Button>
                </NotificationDropdown>

                <MessageDropdown>
                  <Button variant="ghost" size="icon" className="relative">
                    <MessageSquare className="h-5 w-5" />
                    {unreadMessages > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadMessages}
                      </Badge>
                    )}
                  </Button>
                </MessageDropdown>

                <Link to="/profile">
                  <Button variant="ghost">Profile</Button>
                </Link>
                <Link to="/books">
                  <Button variant="ghost">Books</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 