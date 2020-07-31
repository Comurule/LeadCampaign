const express = require('express');
const router = express.Router();
const tools = require('./../modules/tools');
const { Department, Role, Profile, CurrentBusiness } = require('./../models');

router.get('/', async (req, res) => {
    console.log('I am in user display');
    let department = await Department.findOrCreate({ where: { id: req.user.DepartmentId } });
    let role = await Role.findOrCreate({where: {id:  req.user.RoleId}});
    let profile = await Profile.findOrCreate({where: {id: req.user.ProfileId}});
    let currentBusiness = await CurrentBusiness.findOrCreate({where: {id: req.user.CurrentBusinessId }});

    res.render('pages/userMain', {
        title: 'Dashboard',
        userContents: 'This is main user page after login - We have different information about the current logged in user.',
        startDate: tools.convertMillisecondsToStringDate(req.session.startDate),
        endDate: tools.convertMillisecondsToStringDate(req.session.lastRequestDate),
        user: req.user,
        department_name: department[0].department_name,
        role_name: role[0].role_name,
        profile_name: profile[0].profile_name,
        current_business_name: currentBusiness[0].current_business_name,
        layout: 'layouts/main',
        functioName: 'GET USER PAGE'
    });
});

module.exports = router;
