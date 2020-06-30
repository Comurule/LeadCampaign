/**
 * Main Routes.
 * Author: Babatope Olajide.
 * Version: 1.0.0
 * Release Date: 08-April-2020
 * Last Updated: 09-April-2020
 */

/**
 * Module dependencies.
 */
const express = require('express');
const router = express.Router();

const aboutController = require('../controllers/apiContollers/aboutController');
const currentBusinessController = require('../controllers/apiContollers/currentBusinessController');
const departmentController = require('../controllers/apiContollers/departmentController');
const postController = require('../controllers/apiContollers/postController');
const profileController = require('../controllers/apiContollers/profileController');
const roleController = require('../controllers/apiContollers/roleController');
const userController = require('../controllers/apiContollers/userController');
const categoryController = require('../controllers/apiContollers/categoryController');
const permissionController = require('../controllers/apiContollers/permissionController');
const indexController = require('../controllers/apiContollers/indexController');

const { getAllPostsByDept, getAllPostsByUsername, 
    getAllPostsByUsernameByDept, getAllUsersByRole,
    getAllUsersByProfile, getAllPostsByCategory,
    getAllPostsByUserInCurrentBusiness,
    getAllPostsByUserInCurrentBusinessInDept,
    getAllPostsForCurrentBusiness,
    getAllPostsByUserInCurrentBusinessInDeptInRoleInProfile,
} = require('../controllers/apiContollers/specialController');

console.log("I am in api/v1 routes");

//ASSIGNMENT ROUTES

//Get all Posts by department name
router.get('/departments/:department_name/posts', getAllPostsByDept);

//Get all Posts by Username
router.get('/users/:username/posts', getAllPostsByUsername);

//Get all Posts by username in department
router.get('/users/:username/departments/:department_name/posts', getAllPostsByUsernameByDept);

//Get all Users in a role
router.get('/roles/:role_name/users', getAllUsersByRole);

//Get all Users in a profile
router.get('/profiles/:profile_name/users', getAllUsersByProfile);

//Get all Posts by Category Name
router.get('/categories/:category_name/posts', getAllPostsByCategory);


//Get all Posts by a User in a Current Bsiness
router.get(
    '/current-businesses/:current_business_name/users/:username/posts', 
    getAllPostsByUserInCurrentBusiness
);

//Get all Posts by a User in a Current Bsiness in a deapartment
router.get(
    '/current-businesses/:current_business_name/departments/:department_name/users/:username/posts', 
    getAllPostsByUserInCurrentBusinessInDept
);

//Get all Posts for a Current Bsiness
router.get('/current-businesses/:current_business_name/posts', getAllPostsForCurrentBusiness);

//Get all Posts by a User in a Current Bsiness
router.get(
    '/current-businesses/:current_business_name/departments/:department_name/roles/:role_name/profiles/:profile_name/users/:username/posts', 
    getAllPostsByUserInCurrentBusinessInDeptInRoleInProfile
);



// USER ROUTES

// POST USER CREATE
router.post('/user/create', userController.postUserCreate); 

// POST USER UPDATE
router.post('/user/:user_id/update', userController.postUserUpdate); 

// GET USER DELETE
router.get('/user/:user_id/delete', userController.getUserDelete); 

// GET USER LIST
router.get('/users', userController.getUserList); 

// GET USER DETAILS
router.get('/user/:user_id', userController.getUserDetails); 

// ROLE ROUTES

// POST ROLE CREATE
router.post('/role/create', roleController.postRoleCreate); 

// POST ROLE UPDATE
router.post('/role/:role_id/update', roleController.postRoleUpdate); 

// GET ROLE DELETE
router.get('/role/:role_id/delete', roleController.getRoleDelete); 

// GET ROLE LIST
router.get('/roles', roleController.getRoleList); 

// GET ROLE DETAIL 
router.get('/role/:role_id', roleController.getRoleDetails); 


// DEPARTMENT ROUTES

// POST PROFILE CREATE
router.post('/department/create', departmentController.postDepartmentCreate); 

// POST PROFILE UPDATE
router.post('/department/:department_id/update', departmentController.postDepartmentUpdate); 

// GET PROFILE DELETE
router.get('/department/:department_id/delete', departmentController.getDepartmentDelete); 

// GET PROFILE LIST
router.get('/departments', departmentController.getDepartmentList); 

// GET PROFILE DETAILS 
router.get('/department/:department_id', departmentController.getDepartmentDetails);


// PROFILE ROUTES

// POST PROFILE CREATE
router.post('/profile/create', profileController.postProfileCreate); 

// POST PROFILE UPDATE
router.post('/profile/:profile_id/update', profileController.postProfileUpdate); 

// GET PROFILE DELETE
router.get('/profile/:profile_id/delete', profileController.getProfileDelete); 

// GET PROFILE LIST
router.get('/profiles', profileController.getProfileList); 

// GET PROFILE DETAILS 
router.get('/profile/:profile_id', profileController.getProfileDetails);


// POST PROFILE CREATE
router.post('/current-business/create', currentBusinessController.postCurrentBusinessCreate); 

// POST PROFILE UPDATE
router.post('/current-business/:current_business_id/update', currentBusinessController.postCurrentBusinessUpdate); 

// GET PROFILE DELETE
router.get('/current-business/:current_business_id/delete', currentBusinessController.getCurrentBusinessDelete); 

// GET PROFILE LIST
router.get('/current-businesses', currentBusinessController.getCurrentBusinessList); 

// GET PROFILE DETAILS 
router.get('/current-business/:current_business_id', currentBusinessController.getCurrentBusinessDetails);


// CATEGORY ROUTES

// POST POST CREATE
router.post('/category/create', categoryController.postCategoryCreate); 

// POST POST UPDATE
router.post('/category/:category_id/update', categoryController.postCategoryUpdate); 

// GET POST DELETE
router.get('/category/:category_id/delete', categoryController.getCategoryDelete); 

// GET POST LIST
router.get('/categories', categoryController.getCategoryList); 

// GET POST DETAILS 
router.get('/category/:category_id', categoryController.getCategoryDetails);


// PERMISSION ROUTES

// POST PERMISSION CREATE
router.post('/permission/create', permissionController.postPermissionCreate); 

// POST PERMISSION UPDATE
router.post('/permission/:permission_id/update', permissionController.postPermissionUpdate); 

// GET PERMISSION DELETE
router.get('/permission/:permission_id/delete', permissionController.getPermissionDelete); 

// GET PERMISSION LIST
router.get('/permissions', permissionController.getPermissionList); 

// GET PERMISSION DETAILS 
router.get('/permission/:permission_id', permissionController.getPermissionDetails);


// POST ROUTES

// POST POST CREATE
router.post('/post/create', postController.postPostCreate); 

// POST POST UPDATE
router.post('/post/:post_id/update', postController.postPostUpdate); 

// GET POST DELETE
router.get('/post/:post_id/delete', postController.getPostDelete); 

// GET POST LIST
router.get('/posts', postController.getPostList); 

// GET POST DETAILS 
router.get('/post/:post_id', postController.getPostDetails);

// GET POST POST BY EMAIL 
router.get('/posts/:email', postController.getPostListByEmail);

// GET POST BY DEPARTMENT
router.get('/posts/department/:department_name', postController.getPostListByDepartment);


// GET ABOUT PAGE
router.get('/about', aboutController.getAbout);

router.get('/', indexController.getIndex);

module.exports = router;
