/**
 * Controller for Lead.
 * Author: Chibuike Umechukwu.
 * Version: 1.0.0
 * Release Date: 20-July-2020
 * Last Updated: 22-July-2020
 */

/**
 * Module dependencies.
 */
const { Lead, PreferenceCenter } = require('../../models');
const{ 
    errorRes, errorLog, successResWithData
} = require('../../utils/apiResponse');

// Handle User create on POST.
exports.createLead = async(req, res) => {
    console.log(req.body);
    validateInput(req, res);

    const {email} = req.body;
    
    try {
            //check for duplicate in the database
            const checkLead = await Lead.findOne({ where: { email }  });
            if(checkLead) {
                return errorRes( res, 'This Email has been used...')
            }else{
                // set the model to always accept (leadCurrency.toUpperCase());
                const createdLead = await Lead.create(req.body)

                //add the selected preferences
                const addPreferences = await createOrUpdatePreferences( req, res, createdLead, 'create' )
                if(!addPreferences) {
                    await Lead.destroy({ where: { id: createdLead.id } })
                    return errorRes(res, 'Failed to add Preferences');
                }

                //Success Response
                const data = await createdLead;
                successResWithData( res, 'Lead created Successfully', data )
                    
            
            }     
    } catch (error) {
        console.log(error);
        await Lead.destroy({ where: { id: createdLead.id } })
        errorLog( res, 'Lead creation was Unsuccessful.')
    }
    
};
 
exports.updateLead = async(req, res) => {
    
    validateInput(req, res);

    const {email} = req.body;
    try {
        //check for duplicate in the database
        const checkLead = await Lead.findOne({ where: { email }  });
        if( checkLead && checkLead.id != req.params.leadId ) {
            return errorRes( res, 'This Email has been used...')
        }else{
            
            const updatedLead = await Lead.update( req.body, 
                { 
                    where: { id: req.params.leadId }  
                }
            )

            //add the selected preferences
            const data = await Lead.findByPk( req.params.leadId );
            const updatePreferences = await createOrUpdatePreferences( req, res, data, 'update' )
            if(!updatePreferences)return errorRes(res, 'Lead Updated but Failed to update Preferences');

            //Success Response
            
            successResWithData( res, 'Lead updated Successfully', data )
        }     
   
    } catch (error) {
        console.log(error);
        errorLog( res, 'Lead update was Unsuccessful.')
    }
    
};

exports.getLead = async (req, res) =>{
    try {
        const lead = await Lead.findByPk( req.params.leadId, {
            include: PreferenceCenter
        } )
        if(!lead) return errorRes( res, 'Invalid Lead Id')

        //Success Response
        const data = await lead
        successResWithData( res, 'Lead Account Details', data );
               
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.deleteLead = async (req, res) =>{
    try {
        await Lead.destroy( { where: { id: req.params.leadId }  } )
        
        //Success Response
        successRes( res, 'Lead Account deleted successfully.' );
               
    } catch (error) {
        console.log(error);
        errorLog( res, 'Something went wrong' );
    }
    
};

exports.getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.findAll();
        
        //Success Response
        const data = await leads
        successResWithData( res, 'Lead List', data ) 

    } catch (error) {
        console.log(error)
        errorLog( res, 'Something went Wrong' );
    }
    
};

// LEAD HELPERS
const validateInput = (req, res) => {
    const { 
        firstName, lastName, email, username, password, address, city, country,
        leadCurrency, leadLanguage, companyName, companyEmail, companyWebsite,
        companyAddress, companyCity, companyCountry, createdBy, modifiedBy
    } = req.body;

    //check for empty fields
    if( 
        !firstName || !lastName || !email || !username || !password || !address ||
        !city || !country || !leadCurrency || !leadLanguage  || 
        !companyName || !companyEmail || !companyWebsite || !companyAddress ||
        !companyCity || !companyCountry || !createdBy || !modifiedBy ||
        firstName == '' || lastName == '' || email == '' || username == '' || 
        password == '' || address == '' || city == '' || country == '' ||
        leadCurrency == '' || leadLanguage == '' ||  
        companyName == '' || companyEmail == '' || companyWebsite == '' ||
        companyAddress == '' || companyCity == '' || companyCountry == '' ||
        createdBy == '' || modifiedBy == ''
    ) errorRes( res, 'Fill all Fields' );
    
    //validate the password
    if( password.length < 8 ) 
        return errorRes( res, 'Password should not be less than 8 characters.' )

    //validate leadCurrency 
    if( !leadCurrency.match(/^[A-Za-z]+$/) || leadCurrency.trim().length != 3 )
        return errorRes( res, 'Currency should have three alphabets only.' )

    //validate companyWebsite
    const regex = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi)
    if( !companyWebsite.match(regex) ) return errorRes( res, 'Wrong company URL...')
}

const createOrUpdatePreferences = async(req, res, leadData, actionType) => {
    
    const { preferences } = req.body;

    if( !preferences || typeof(preferences) != 'object') 
        return false

    //Create Preferences in Lead Profile
    if( actionType == 'create' && preferences.length > 0 ) {
        try {
            if(preferences.length == 1){
                const preference = await PreferenceCenter.findByPk(preferences)
                await leadData.addPreferenceCenter(preference);
                return true

            }else {
                preferences.forEach( async preferenceId => {
                    const preference = await PreferenceCenter.findByPk(preferenceId)
                    await leadData.addPreferenceCenter(preference);
                })
                
                return true
            }
        } catch (error) {
            console.log(error);
            return false
        }
        //Update Preferences in Lead Profile
    } else if ( actionType == 'update' && preferences.length > 0 ) {
        try {
            //delete all lead preferences
            const oldPreferences = await leadData.getPreferenceCenter();
            await leadData.removePreferenceCenter(oldPreferences)

            //add the incoming Preferences to this lead
            if(preferences.length == 1){

                const preference = await PreferenceCenter.findByPk(preferences)
                await leadData.addPreferenceCenter(preference);
               return true;
            }else{
                preferences.forEach( async preferenceId => {
                    const preference = await PreferenceCenter.findByPk(preferenceId)
                    await leadData.addPreferenceCenter(preference);
                })
                
               return true;
            }
        } catch (error) {
            console.log(error);
            return false
        }
    }
    
   
}