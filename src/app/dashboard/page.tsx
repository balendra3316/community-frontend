// // src/app/dashboard/page.tsx
// "use client";

// import React, { useState } from 'react';
// import { 
//   AppBar, 
//   Toolbar, 
//   IconButton, 
//   Avatar, 
//   Badge, 
//   Menu, 
//   MenuItem, 
//   Dialog, 
//   DialogTitle, 
//   DialogContent,
//   DialogActions, 
//   Button, 
//   TextField,
//   Select,
//   FormControl,
//   InputLabel,
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Tab,
//   Tabs,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Divider
// } from '@mui/material';
// import {
//   Notifications as NotificationsIcon,
//   Close as CloseIcon,
//   ThumbUp as ThumbUpIcon,
//   ChatBubbleOutline as CommentIcon,
//   PushPin as PinIcon,
//   Home as HomeIcon,
//   School as ClassroomIcon,
//   CalendarMonth as CalendarIcon,
//   People as MembersIcon,
//   Leaderboard as LeaderboardIcon,
//   Info as AboutIcon,
//   Menu as MenuIcon
// } from '@mui/icons-material';
// import Image from 'next/image';

// // Define types for our data structures
// interface User {
//   id: string;
//   name: string;
//   avatar: string;
//   role?: string;
// }

// interface Comment {
//   id: string;
//   user: User;
//   content: string;
//   timestamp: string;
//   likes: number;
//   replies?: Comment[];
// }

// interface Post {
//   id: string;
//   user: User;
//   title: string;
//   content: string;
//   timestamp: string;
//   category: string;
//   isPinned: boolean;
//   likes: number;
//   commentsCount: number;
//   comments?: Comment[];
// }

// interface Notification {
//   id: string;
//   content: string;
//   timestamp: string;
//   isRead: boolean;
//   user?: User;
// }

// // Dummy data for posts
// const dummyPosts: Post[] = [
//   {
//     id: '1',
//     user: {
//       id: '1',
//       name: 'Andy Lo',
//       avatar: '/avatars/andy.jpg',
//       role: 'Admin'
//     },
//     title: '[Tutorial] n8n Tutorial Beginner Course (10+ Tips & Tricks Included)',
//     content: 'We heard you loud and clear! By request from our beloved members, we\'ve created an n8n Beginner Course (2025) that walks you through everything—from mastering the Editor UI to building your first AI agent.',
//     timestamp: '20d',
//     category: 'Tutorials',
//     isPinned: true,
//     likes: 97,
//     commentsCount: 89
//   },
//   {
//     id: '2',
//     user: {
//       id: '1',
//       name: 'Andy Lo',
//       avatar: '/avatars/andy.jpg',
//       role: 'Admin'
//     },
//     title: '🚀 All 50+ Templates + Tech Support Are Now Available Here!',
//     content: 'This post is for the Andynocode community first. You get the first chance to join before we increase the price! 👉 Join Andynocode Premium Now 🔥 Why Join Andynocode Premium? ✅ Faceless Video',
//     timestamp: 'Feb 7',
//     category: 'General discussion',
//     isPinned: true,
//     likes: 88,
//     commentsCount: 88
//   },
//   {
//     id: '3',
//     user: {
//       id: '2',
//       name: 'Aleksandr Partnership',
//       avatar: '/avatars/alex.jpg'
//     },
//     title: '1500+ n8n automations for free',
//     content: 'Hi AI community, Here are 1500+ n8n based ai automations for your exploration and enjoyment. we converted publicly available automations into markdown format so it can be better searched and understood.',
//     timestamp: '3d',
//     category: 'General discussion',
//     isPinned: false,
//     likes: 15,
//     commentsCount: 25
//   },
//   {
//     id: '4',
//     user: {
//       id: '3',
//       name: 'Max Gibson',
//       avatar: '/avatars/max.jpg'
//     },
//     title: 'Deploy Crawler: Your Web Data Solution',
//     content: 'Unlimited free crawling for community members! Get instant access to nearly-unlimited n8n nodes and templates.',
//     timestamp: '8h',
//     category: 'n8n Discussion',
//     isPinned: false,
//     likes: 1,
//     commentsCount: 2
//   }
// ];

// // Dummy data for comments
// const dummyComments: Comment[] = [
//   {
//     id: '1',
//     user: {
//       id: '4',
//       name: 'Tracee Wells',
//       avatar: '/avatars/tracee.jpg'
//     },
//     content: 'This is fire thanks @Aleksandr Partnership Have also requested access 🔥',
//     timestamp: '14h',
//     likes: 0,
//     replies: []
//   },
//   {
//     id: '2',
//     user: {
//       id: '2',
//       name: 'Aleksandr Partnership',
//       avatar: '/avatars/alex.jpg'
//     },
//     content: '@Tracee Wells shared',
//     timestamp: '10h',
//     likes: 1,
//     replies: []
//   },
//   {
//     id: '3',
//     user: {
//       id: '4',
//       name: 'Tracee Wells',
//       avatar: '/avatars/tracee.jpg'
//     },
//     content: '@Aleksandr Partnership Thanks 👍 but I tried and its still not available 😊',
//     timestamp: '5h',
//     likes: 0,
//     replies: []
//   },
//   {
//     id: '4',
//     user: {
//       id: '5',
//       name: 'Gaetan Leonhard',
//       avatar: '/avatars/gaetan.jpg'
//     },
//     content: 'Amazing',
//     timestamp: '7h',
//     likes: 0,
//     replies: []
//   }
// ];

// // Dummy notifications
// const dummyNotifications: Notification[] = [
//   {
//     id: '1',
//     content: 'Andy Lo replied to your comment',
//     timestamp: '1h ago',
//     isRead: false,
//     user: {
//       id: '1',
//       name: 'Andy Lo',
//       avatar: '/avatars/andy.jpg'
//     }
//   },
//   {
//     id: '2',
//     content: 'New tutorial available: "Advanced n8n Workflows"',
//     timestamp: '3h ago',
//     isRead: false
//   },
//   {
//     id: '3',
//     content: 'Your post received 5 new likes',
//     timestamp: '1d ago',
//     isRead: true
//   },
//   {
//     id: '4',
//     content: 'Welcome to the community!',
//     timestamp: '3d ago',
//     isRead: true
//   }
// ];

// // Categories for posts
// const categories = ['#DanceTips', '#SelfLove', '#Events'];

// export default function Dashboard() {
//   // State management
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
//   const [openPostModal, setOpenPostModal] = useState(false);
//   const [openPostDetail, setOpenPostDetail] = useState(false);
//   const [selectedPost, setSelectedPost] = useState<Post | null>(null);
//   const [currentTab, setCurrentTab] = useState(0);
//   const [category, setCategory] = useState('');
//   const [postContent, setPostContent] = useState('');
//   const [postTitle, setPostTitle] = useState('');
//   const [commentContent, setCommentContent] = useState('');
//   const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

//   // Tab options
//   const tabs = ['All', 'General discussion', 'n8n Discussion', 'Tutorials'];

//   // Handle menu open/close
//   const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleCloseMenu = () => {
//     setAnchorEl(null);
//   };

//   // Handle notification menu
//   const handleNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
//     setNotificationAnchor(event.currentTarget);
//   };

//   const handleCloseNotificationMenu = () => {
//     setNotificationAnchor(null);
//   };

//   // Handle post modal
//   const handleOpenPostModal = () => {
//     setOpenPostModal(true);
//   };

//   const handleClosePostModal = () => {
//     setOpenPostModal(false);
//     setPostContent('');
//     setPostTitle('');
//     setCategory('');
//   };

//   // Handle post submission
//   const handleSubmitPost = () => {
//     // Here you would normally handle API submission
//     console.log({ title: postTitle, content: postContent, category });
//     handleClosePostModal();
//   };

//   // Handle post detail view
//   const handleOpenPostDetail = (post: Post) => {
//     setSelectedPost(post);
//     setOpenPostDetail(true);
//   };

//   const handleClosePostDetail = () => {
//     setOpenPostDetail(false);
//     setSelectedPost(null);
//     setCommentContent('');
//   };

//   // Handle comment submission
//   const handleSubmitComment = () => {
//     // Here you would normally handle API submission
//     console.log({ postId: selectedPost?.id, content: commentContent });
//     setCommentContent('');
//   };

//   // Handle tab change
//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setCurrentTab(newValue);
//   };

//   // Handle mobile drawer
//   const handleDrawerToggle = () => {
//     setMobileDrawerOpen(!mobileDrawerOpen);
//   };

//   const drawer = (
//     <div>
//       <div className="flex items-center justify-between p-4">
//         <div className="flex items-center">
//           <div className="w-8 h-8 mr-2 bg-purple-500 rounded-lg flex items-center justify-center">
//             <span className="text-white">A</span>
//           </div>
//           <span className="font-semibold">Andynocode</span>
//         </div>
//         <IconButton 
//           onClick={handleDrawerToggle}
//           className="sm:hidden"
//         >
//           <CloseIcon />
//         </IconButton>
//       </div>
//       <Divider />
//       <List>
//         {['Community', 'Classroom', 'Calendar', 'Members', 'Leaderboards', 'About'].map((text, index) => (
//           <ListItem key={text} disablePadding>
//             <ListItemIcon className="ml-4">
//               {index === 0 ? <HomeIcon /> : 
//                index === 1 ? <ClassroomIcon /> : 
//                index === 2 ? <CalendarIcon /> : 
//                index === 3 ? <MembersIcon /> : 
//                index === 4 ? <LeaderboardIcon /> : <AboutIcon />}
//             </ListItemIcon>
//             <ListItemText primary={text} />
//           </ListItem>
//         ))}
//       </List>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* App Bar */}
//       <AppBar position="static" color="default" elevation={0} className="bg-white border-b">
//         <Toolbar className="flex justify-between">
//           <div className="flex items-center">
//             <IconButton
//               edge="start"
//               color="inherit"
//               aria-label="menu"
//               className="sm:hidden mr-2"
//               onClick={handleDrawerToggle}
//             >
//               <MenuIcon />
//             </IconButton>
//             <div className="hidden sm:flex items-center">
//               <div className="w-8 h-8 mr-2 bg-purple-500 rounded-lg flex items-center justify-center">
//                 <span className="text-white">A</span>
//               </div>
//               <span className="font-semibold">Andynocode</span>
//             </div>
//           </div>
//           <div className="flex">
//             <IconButton
//               aria-label="show notifications"
//               onClick={handleNotificationMenu}
//             >
//               <Badge badgeContent={2} color="error">
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton>
//             <IconButton
//               aria-label="account of current user"
//               aria-controls="menu-appbar"
//               aria-haspopup="true"
//               onClick={handleMenu}
//               color="inherit"
//             >
//               <Avatar alt="User" src="/avatars/user.jpg" className="w-8 h-8" />
//             </IconButton>
//           </div>
//         </Toolbar>
//       </AppBar>

//       {/* Mobile Drawer */}
//       <Drawer
//         variant="temporary"
//         open={mobileDrawerOpen}
//         onClose={handleDrawerToggle}
//         ModalProps={{ keepMounted: true }}
//       >
//         {drawer}
//       </Drawer>

//       {/* Main Content */}
//       <div className="flex">
//         {/* Desktop Side Navigation */}
//         <div className="hidden sm:block w-60 bg-white h-screen border-r">
//           <List>
//             <ListItem button selected className="bg-gray-100">
//               <ListItemText primary="Community" />
//             </ListItem>
//             <ListItem button>
//               <ListItemText primary="Classroom" />
//             </ListItem>
            
//             <ListItem button>
//               <ListItemText primary="Leaderboards" />
//             </ListItem>
           
//           </List>
//         </div>

//         {/* Content Area */}
//         <div className="flex-1 p-4">
//           {/* Write Something Card */}
//           <Card className="mb-4 shadow-sm">
//             <CardContent className="p-2 flex items-center">
//               <Avatar alt="User" src="/avatars/user.jpg" className="mr-3" />
//               <Button 
//                 variant="outlined" 
//                 fullWidth 
//                 className="text-left justify-start text-gray-500 bg-gray-50 hover:bg-gray-100"
//                 onClick={handleOpenPostModal}
//               >
//                 Write something
//               </Button>
//             </CardContent>
//           </Card>

//           {/* Filter Tabs */}
//           <div className="mb-4 bg-white rounded-lg shadow-sm">
//             <Tabs 
//               value={currentTab} 
//               onChange={handleTabChange}
//               variant="scrollable"
//               scrollButtons="auto"
//               className="border-b"
//             >
//               {tabs.map((tab, index) => (
//                 <Tab key={index} label={tab} />
//               ))}
//             </Tabs>
//           </div>

//           {/* Posts */}
//           <div className="space-y-4">
//             {dummyPosts.map(post => (
//               <Card 
//                 key={post.id} 
//                 className={`shadow-sm ${post.isPinned ? 'border-2 border-yellow-200' : ''}`}
//                 onClick={() => handleOpenPostDetail(post)}
//               >
//                 <CardContent>
//                   <div className="flex items-center mb-3">
//                     <Avatar alt={post.user.name} src={post.user.avatar} className="mr-3" />
//                     <div>
//                       <div className="flex items-center">
//                         <Typography variant="subtitle1" className="font-medium">{post.user.name}</Typography>
//                         {post.user.role === 'Admin' && (
//                           <span className="ml-2 px-1 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">
//                             {post.user.role}
//                           </span>
//                         )}
//                       </div>
//                       <Typography variant="caption" color="textSecondary">
//                         {post.timestamp} • {post.category}
//                       </Typography>
//                     </div>
//                     {post.isPinned && (
//                       <PinIcon className="ml-auto text-yellow-600" />
//                     )}
//                   </div>
//                   <Typography variant="h6" className="mb-2">{post.title}</Typography>
//                   <Typography variant="body2" className="mb-4">{post.content}</Typography>
//                   <div className="flex items-center text-gray-600">
//                     <div className="flex items-center mr-4">
//                       <ThumbUpIcon fontSize="small" className="mr-1" />
//                       <span>{post.likes}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <CommentIcon fontSize="small" className="mr-1" />
//                       <span>{post.commentsCount}</span>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Profile Menu */}
//       <Menu
//         anchorEl={anchorEl}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         keepMounted
//         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//         open={Boolean(anchorEl)}
//         onClose={handleCloseMenu}
//       >
//         <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
//         <MenuItem onClick={handleCloseMenu}>Logout</MenuItem>
//       </Menu>

//       {/* Notifications Menu */}
//       <Menu
//         anchorEl={notificationAnchor}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         keepMounted
//         transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//         open={Boolean(notificationAnchor)}
//         onClose={handleCloseNotificationMenu}
//         PaperProps={{
//           style: {
//             maxHeight: 400,
//             width: 320,
//           },
//         }}
//       >
//         <div className="p-2 bg-blue-50 flex justify-between items-center">
//           <Typography variant="subtitle1" className="font-medium">Notifications</Typography>
//           <Typography variant="body2" className="text-blue-600 cursor-pointer">Mark all read</Typography>
//         </div>
//         {dummyNotifications.map(notification => (
//           <MenuItem 
//             key={notification.id} 
//             onClick={handleCloseNotificationMenu}
//             className={notification.isRead ? 'opacity-70' : 'bg-blue-50'}
//           >
//             <div className="flex items-start py-1">
//               {notification.user && (
//                 <Avatar 
//                   alt={notification.user.name} 
//                   src={notification.user.avatar}
//                   className="mr-3 mt-1"
//                   sx={{ width: 32, height: 32 }}
//                 />
//               )}
//               <div>
//                 <Typography variant="body2">{notification.content}</Typography>
//                 <Typography variant="caption" color="textSecondary">{notification.timestamp}</Typography>
//               </div>
//             </div>
//           </MenuItem>
//         ))}
//         <div className="p-2 border-t">
//           <Typography 
//             variant="body2" 
//             className="text-center text-blue-600 cursor-pointer"
//             onClick={handleCloseNotificationMenu}
//           >
//             See all notifications
//           </Typography>
//         </div>
//       </Menu>

//       {/* Create Post Modal */}
//       <Dialog 
//         open={openPostModal} 
//         onClose={handleClosePostModal}
//         fullWidth
//         maxWidth="sm"
//       >
//         <DialogTitle>
//           <div className="flex justify-between items-center">
//             <span>Create Post</span>
//             <IconButton onClick={handleClosePostModal} size="small">
//               <CloseIcon />
//             </IconButton>
//           </div>
//         </DialogTitle>
//         <DialogContent>
//           <TextField
//             autoFocus
//             margin="dense"
//             id="post-title"
//             label="Title"
//             type="text"
//             fullWidth
//             variant="outlined"
//             value={postTitle}
//             onChange={(e) => setPostTitle(e.target.value)}
//             className="mb-4"
//           />
//           <TextField
//             margin="dense"
//             id="post-content"
//             label="Write something..."
//             multiline
//             rows={4}
//             fullWidth
//             variant="outlined"
//             value={postContent}
//             onChange={(e) => setPostContent(e.target.value)}
//             className="mb-4"
//           />
//           <FormControl fullWidth variant="outlined">
//             <InputLabel id="category-label">Select a category</InputLabel>
//             <Select
//               labelId="category-label"
//               id="category"
//               value={category}
//               onChange={(e) => setCategory(e.target.value as string)}
//               label="Select a category"
//             >
//               {categories.map((cat) => (
//                 <MenuItem key={cat} value={cat}>{cat}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClosePostModal} color="primary">
//             Cancel
//           </Button>
//           <Button 
//             onClick={handleSubmitPost} 
//             color="primary" 
//             variant="contained"
//             disabled={!postTitle || !postContent || !category}
//           >
//             Post
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Post Detail Modal */}
//       <Dialog
//         open={openPostDetail}
//         onClose={handleClosePostDetail}
//         fullWidth
//         maxWidth="md"
//         scroll="paper"
//       >
//         <DialogTitle>
//           <div className="flex justify-between items-center">
//             <div className="flex items-center">
//               <Avatar 
//                 alt={selectedPost?.user.name} 
//                 src={selectedPost?.user.avatar} 
//                 className="mr-3"
//               />
//               <div>
//                 <Typography variant="subtitle1" className="font-medium">
//                   {selectedPost?.user.name}
//                 </Typography>
//                 <Typography variant="caption" color="textSecondary">
//                   {selectedPost?.timestamp} • {selectedPost?.category}
//                 </Typography>
//               </div>
//             </div>
//             <IconButton onClick={handleClosePostDetail} size="small">
//               <CloseIcon />
//             </IconButton>
//           </div>
//         </DialogTitle>
//         <DialogContent dividers>
//           <Typography variant="h6" className="mb-2">
//             {selectedPost?.title}
//           </Typography>
//           <Typography variant="body1" className="mb-4">
//             {selectedPost?.content}
//           </Typography>
          
//           <div className="flex items-center mb-4 pb-4 border-b">
//             <Button startIcon={<ThumbUpIcon />} className="mr-2">
//               Like ({selectedPost?.likes})
//             </Button>
//             <Button startIcon={<CommentIcon />}>
//               Comment ({selectedPost?.commentsCount})
//             </Button>
//           </div>

//           {/* Comments Section */}
//           <Typography variant="h6" className="mb-3">Comments</Typography>
//           <div className="space-y-4 mb-6">
//             {dummyComments.map(comment => (
//               <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
//                 <div className="flex items-start">
//                   <Avatar 
//                     alt={comment.user.name} 
//                     src={comment.user.avatar} 
//                     className="mr-3"
//                     sx={{ width: 32, height: 32 }}
//                   />
//                   <div className="flex-1">
//                     <div className="flex items-center mb-1">
//                       <Typography variant="subtitle2" className="font-medium">
//                         {comment.user.name}
//                       </Typography>
//                       <Typography variant="caption" color="textSecondary" className="ml-2">
//                         {comment.timestamp}
//                       </Typography>
//                     </div>
//                     <Typography variant="body2">{comment.content}</Typography>
//                     <div className="flex items-center mt-1 text-sm text-gray-600">
//                       <Button size="small" className="min-w-0 mr-2 p-0">Like ({comment.likes})</Button>
//                       <Button size="small" className="min-w-0 p-0">Reply</Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             <Button color="primary" className="mt-2">
//               Load more comments
//             </Button>
//           </div>
//         </DialogContent>
//         <div className="p-3 bg-gray-50 flex items-start">
//           <Avatar 
//             alt="User" 
//             src="/avatars/user.jpg" 
//             className="mr-3"
//             sx={{ width: 32, height: 32 }}
//           />
//           <TextField
//             placeholder="Write a comment..."
//             multiline
//             rows={1}
//             fullWidth
//             variant="outlined"
//             size="small"
//             value={commentContent}
//             onChange={(e) => setCommentContent(e.target.value)}
//             InputProps={{
//               endAdornment: (
//                 <Button 
//                   color="primary" 
//                   disabled={!commentContent.trim()} 
//                   onClick={handleSubmitComment}
//                 >
//                   Post
//                 </Button>
//               )
//             }}
//           />
//         </div>
//       </Dialog>
//     </div>
//   );
// }




















