const { PreferenceCenter, Lead } = require('../../models');
const flash = require('connect-flash');


const { errorRes, errorLog, successResWithData, successRes } = require('../../utils/apiResponse');
const { renderPage } = require("../../utils/webResponse");

exports.getCreatePreference = async (req, res) => {
    const preferences = await PreferenceCenter.findAll();
    //Success Response
    renderPage(req, res, 'Create Preference', 'GET PREFERENCE CREATE', {preferences})
    
};

exports.createPreference = async (req, res) => {
    
    try {    
        //validate inputs
        const inputData = await validateInputs(req,res);

        //check if there is a duplicate in the database
        const checkPreference = await PreferenceCenter.findOne({ 
            where: { name: inputData.name } 
        });
        if( checkPreference ) {
            req.flash('error', 'This Preference Center already exists in the database.');
            return res.redirect('back');
        };
        
        await PreferenceCenter.create( inputData );

        //Success response
        req.flash('success', 'Preference created Successfully...' )
        return res.redirect('/main/preferences');

    } catch (error) {
        console.log(error);
       res.redirect('back');
    }
};

exports.getUpdatePreference = async (req, res) => {
    const preferences = await PreferenceCenter.findAll();
    const preference = preferences.filter( preference=> preference.id == Number(req.params.preferenceId))
    //Success Response
    renderPage(req, res, 'Update Preference', 'GET PREFERENCE UPDATE', {preference, preferences})
  
};
exports.updatePreference = async (req, res) => {
   
    try {

        const inputData = await validateInputs(req, res);
        if(inputData.parentPC == req.params.preferenceId) {
            req.flash('error', 'invalid Parent PC value');
            return res.redirect('back');
        }
        //check if there is a duplicate in the database
        const checkPreference = await PreferenceCenter.findOne({ 
            where: { name: inputData.name } 
        });
        if(checkPreference && checkPreference.id != req.params.preferenceId) {
            req.flash('error', 'This Preference already exists in the database.');
            return res.redirect('back');
        };
        await PreferenceCenter.update( inputData ,{
            where: { id: req.params.preferenceId }
        });
        //Success Response
        req.flash('success', 'Preference updated Successfully...')
        return res.redirect('/main/preferences');
           
    } catch (error) {
        console.log(error)
        req.flash('error', 'Preference Center Update is Unsuccessful.')
        res.redirect('back')
    }
};

exports.deletePreference = async (req, res) => {
    try {
        //check if the id is valid
        const checkPreference = await PreferenceCenter.findByPk( req.params.preferenceId )
        if(!checkPreference) 
            return errorRes( res, 'Invalid Entry Details' );

        await PreferenceCenter.destroy({ where: { id: req.params.preferenceId } })

        //Success Response
        req.flash('success', 'Preference deleted Successfully...')
        return res.redirect('/main/preferences');

    } catch (error) {
        console.log(error);
        errorLog(
            res, 
            'Error: Something went wrong.'
        )
    }
};

exports.getPreference = async (req, res) => {
    try {
        const preference = await PreferenceCenter.findByPk( req.params.preferenceId, { include: Lead });
        if(!preference) errorRes( res, 'Invalid Entry DEtails' )

        const parentPC = await PreferenceCenter.findByPk( preference.parentPC )
        //Success Response
        renderPage(req, res, 'Preference Details', 'GET PREFERENCE DETAILS', {preference, parentPC})
     
    } catch (error) {
        console.log(error);
        errorLog(
            res, 
            'Error: Something went wrong.'
        )
    }
};

exports.getAllPreference = async (req, res) => {
    try {
        const preferences = await PreferenceCenter.findAll();
        if(!preferences) preferences = '';
        //Success Response
        renderPage(req, res, 'Preference List', 'GET PREFERENCE LIST', {preferences})
        
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.' )
    }
};

const validateInputs = async (req, res) => {
    const { name, tier, parentPC, pcCode, displayType } = req.body;
    
    //To check against empty fields
    if(!name || !tier || !pcCode || !displayType ||
        name == '' || tier == '' || pcCode == '' || displayType == ''    
    ) 
        errorRes( res, 'Ensure all fields are filled' )

        // check if the parentPC is valid
        if(parentPC && parentPC != '') {
            const parentPreference = await PreferenceCenter.findByPk(parentPC)
            if(!parentPreference )errorRes( res, 'Invalid Parent Preference Center Input.')
        }

        return { 
            name,
            tier, 
            pcCode, 
            displayType, 
            parentPC: parentPC? parentPC : null };
};