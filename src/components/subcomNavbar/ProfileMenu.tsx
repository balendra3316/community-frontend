

import { memo, useCallback, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';
import { Avatar, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import ProAvatar from '../shared/ProAvatar';

interface SubInfo {
  status: 'none' | 'active' | 'expired';
  endDate?: string;
}

interface User {
  _id: string;
  name?: string;
  avatar?: string;
  subscription?: SubInfo;
}

interface ProfileMenuProps {
  user: User;
  anchorEl: HTMLElement | null;
  open: boolean;
  onMenuOpen: (event: MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
  onLogout: () => Promise<void>;
}

const ProfileMenu = memo(({ 
  user, 
  anchorEl, 
  open, 
  onMenuOpen, 
  onMenuClose, 
  onLogout 
}: ProfileMenuProps) => {
  const router = useRouter();

  const handleProfileClick = useCallback(() => {
    router.push('/profile');
    onMenuClose();
  }, [router, onMenuClose]);

  const handleLogout = useCallback(async () => {
    try {
      await onLogout();
      onMenuClose();
      router.push('/');
    } catch (error) {
    }
  }, [onLogout, onMenuClose, router]);

  const handleMenuClose = useCallback(() => {
    onMenuClose();
  }, [onMenuClose])


  const isPro = user?.subscription?.status === 'active';


  return (
    <>

<div
  className="relative inline-block"
  style={{ width: 34, height: 34 }}  // keep in sync with sx width/height
>
  <Avatar
    src={user.avatar}
    alt={user.name?.charAt(0).toUpperCase()}
    className="cursor-pointer transition-transform duration-200 hover:scale-105"
    sx={{ width: 34, height: 34 }}
    onClick={onMenuOpen}
  />

  {isPro && (
    <span
      className="
        absolute
        bottom-0 right-0
        translate-x-1/4 translate-y-1/4
        pointer-events-none
        flex items-center justify-center
        h-4 min-w-[1.1rem]
        rounded-full
        bg-yellow-300 text-yellow-900
        text-[9px] leading-4 font-extrabold
        px-1
        ring-2 ring-white
        shadow
      "
      title="Pro subscription active"
    >
      pro
    </span>
  )}
</div>

      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ 
          paper: { 
            elevation: 3,
            sx: {
              width: '200px',
              mt: 1.5,
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <User size={16} />
          </ListItemIcon>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogOut size={16} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
});

ProfileMenu.displayName = 'ProfileMenu';
export default ProfileMenu;