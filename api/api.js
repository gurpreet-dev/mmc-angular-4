const express = require('express');

const todoController = require('../controllers/todos');
const userController = require('../controllers/user.controller');
const otController = require('../controllers/opentok.controller');
const videoCatController = require('../controllers/video-categories.controller');
const subPlansController = require('../controllers/subscription-plans.controller');
const paymentsController = require('../controllers/payments.controller');
const awsController = require('../controllers/aws.controller');
const faqController = require('../controllers/faq.controller');
const contactController = require('../controllers/contact.controller');
const staticPagesController = require('../controllers/static-pages.controller');
const auctionController = require('../controllers/auction.controller');

const router = express.Router();

//  Todos

router.post('/todo', todoController.createTodo);
router.get('/todos', todoController.getTodos);
router.delete('/todo/:todoid', todoController.deleteTodo);

//  Users

router.post('/users', userController.create);
router.get('/users/all', userController.list);
router.post('/users/login', userController.login);
router.get('/users/get/:id', userController.get);
router.post('/users/updateOpentokSession', userController.updateOpentokSession); 
router.post('/users/goOnline', userController.goOnline);
router.get('/users/getOnlineUsers', userController.getOnlineUsers); 
router.post('/users/adminlogin', userController.adminlogin);
router.post('/users/changepassword', userController.changepassword);
router.post('/users/forgotpassword', userController.forgotpassword);
router.post('/users/resetpassword', userController.resetpassword);
router.post('/users/edit', userController.edit);
router.post('/users/update_profile_image', userController.updateProfileImage);
router.post('/users/update_banner_image', userController.updateBannerImage);

router.post('/users/create_album', userController.createAlbum);
router.post('/users/get_albums', userController.getAlbums);
router.post('/users/delete_album', userController.deleteAlbum);

router.post('/users/upload_photos', userController.uploadPhotos);
router.post('/users/get_album_photos', userController.albumPhotos);
router.post('/users/delete_image', userController.deleteImage);

router.post('/users/update_payment_info', userController.updatePaymentInfo);

router.get('/users/online_users', userController.getOnlineUsers);
router.get('/users/get_channels', userController.getChannels);
router.post('/users/latest_user_video', userController.latestVideo);
router.post('/users/latest_user_videos_5', userController.latest5Videos);
router.post('/users/like_photo', userController.likePhoto);
router.post('/users/like_video', userController.likeVideo);
router.post('/users/get_user_favorite_photos', userController.getFavoritePhotos);
router.post('/users/get_user_favorite_videos', userController.getFavoriteVideos);
router.post('/users/unlike_photo', userController.unlikePhoto);
router.post('/users/unlike_video', userController.unlikeVideo);
router.post('/users/update_plans', userController.updatePlans);
router.post('/users/check_subscribed', userController.checkSubscribed);
router.post('/users/get_subscriptions', userController.getSubscriptions);
//router.get('/users/check_subscriptions', userController.checkSubscriptions);
router.post('/users/list_user_subscriptions', userController.listUserSubscriptions);
router.get('/users/all_subscriptions', userController.allSubscriptions);
router.post('/users/get_subscription', userController.getSubscription);

//  Opentok

router.get('/opentok/createsession', otController.createSession);
router.post('/opentok/generatetoken', otController.generateToken);

// (Admin)

// Video categories

router.get('/video-categories', videoCatController.allCategory);
router.get('/video-categories/front_list', videoCatController.allCategory2);
router.post('/video-categories/add', videoCatController.addCategory);
router.get('/video-categories/edit/:id', videoCatController.getCategory);
router.post('/video-categories/edit/:id', videoCatController.editCategory);
router.get('/video-categories/delete/:id', videoCatController.deleteCategory);
router.post('/video-categories/get_user_videos', videoCatController.getUserVideos);

// Video subcategories

router.get('/video-subcategories', videoCatController.allSubcategory);
router.post('/video-subcategories/add', videoCatController.addSubcategory);
router.get('/video-subcategories/edit/:id', videoCatController.getSubcategory);
router.post('/video-subcategories/edit/:id', videoCatController.updateSubcategory);
router.post('/video-subcategories/add_video', videoCatController.addVideo);

router.post('/video-subcategories/get_subcat_videos', videoCatController.getSubcategoryVideos);
router.post('/video-subcategories/get_subcat_videosById', videoCatController.getSubcategoryVideosById);
router.post('/video-subcategories/get_video', videoCatController.getVideo);
router.post('/video-subcategories/add_view', videoCatController.incrementView);
router.post('/video-subcategories/get_views', videoCatController.getViews);
router.get('/video-subcategories/get_videos', videoCatController.getVideos);
router.get('/video-subcategories/get_all_videos', videoCatController.getAllVideos);
router.post('/video-subcategories/search_videos', videoCatController.searchVideos);

// Subscription plans

router.get('/plans', subPlansController.list);
router.post('/plans/add', subPlansController.add);
router.get('/plans/delete/:id', subPlansController.delete);
router.get('/plans/edit/:id', subPlansController.get);
router.post('/plans/editt', subPlansController.edit);

// Payments

router.post('/payments/paypal_cc_payment', paymentsController.paypal_cc_payment);
router.post('/payments/paypal', paymentsController.paypal);
router.post('/payments/paypal_execute', paymentsController.paypal_execute);

router.post('/payments/paypal_cc_payment2', paymentsController.paypal_cc_paymenttt);
router.post('/payments/paypal2', paymentsController.paypal2);
router.post('/payments/paypal_execute2', paymentsController.paypal_execute2);

router.post('/payments/auction_paypal_cc_payment', paymentsController.auction_paypal_cc_payment);
router.post('/payments/auction_paypal', paymentsController.auction_paypal);
router.post('/payments/auction_paypal_execute', paymentsController.auction_paypal_execute);

// Faq

router.get('/faq', faqController.list);
router.post('/faq/add', faqController.add);
router.get('/faq/get/:id', faqController.get);
router.post('/faq/edit', faqController.edit);
router.post('/faq/delete', faqController.delete);

// Contact us

router.get('/contact', contactController.list);
router.post('/contact/add', contactController.add);
router.get('/contact/get/:id', contactController.get);
router.post('/contact/edit', contactController.edit);
router.post('/contact/delete', contactController.delete);

// Static Pages

router.post('/static-pages/add', staticPagesController.add);
router.get('/static-pages/get/:id', staticPagesController.get);
router.get('/static-pages/get_by_slug/:slug', staticPagesController.getBySlug);
router.get('/static-pages/list', staticPagesController.list);
router.post('/static-pages/edit', staticPagesController.edit);

// Auction

router.get('/auction/list', auctionController.list);
router.post('/auction/add', auctionController.add);
router.post('/auction/channel_auctions', auctionController.channelAuctions);
router.post('/auction/channel_front_auctions', auctionController.channelFrontAuctions);
router.post('/auction/channel_front_auction_photos', auctionController.channelFrontAuctionPhotos);
router.post('/auction/channel_front_auction_videos', auctionController.channelFrontAuctionVideos);
router.post('/auction/get_auction', auctionController.getAuction);
router.post('/auction/get_expired_auction', auctionController.getExpiredAuction);
router.post('/auction/create_bid', auctionController.createBid);
router.post('/auction/get_auction_bids', auctionController.getAuctionBids);
router.post('/auction/get_expired_auction_bids', auctionController.getExpiredAuctionBids);
//router.get('/auction/announce_winner', auctionController.announceWinner);
router.post('/auction/get_subscriber_auctions', auctionController.getSubscriberAuctions);
router.post('/auction/get_auction_data', auctionController.getAuctionData);

module.exports = router;
