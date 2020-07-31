const { CurrentBusiness  } = require('../models');
const flash = require('connect-flash');
/** 
 * Render Pages on Lead Campaign Front End App
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {String} title - title of the page
 * @param {String} functioName - string used in the switch statement to access the page
 * @param {Object} rest - Additional object to be passed to the page
 * @returns {Object} - Page rendered
 */
exports.renderPage = async (req, res, title, functioName, rest ) => {
    const currentBusiness = await CurrentBusiness.findOrCreate({where: {id: req.user.CurrentBusinessId }});
     res.render('pages/content', {
        title,
        functioName,
        layout: 'layouts/main',
        user: req.user,
        // error: req.flash('error'),
        // success: req.flash('success'),
        current_business_name: currentBusiness[0].current_business_name,
        ...rest
    })
};