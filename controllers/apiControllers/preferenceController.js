const { PreferenceCenter, Lead } = require('../../models');
const { 
    errorRes, errorLog, successResWithData, successRes 
} = require('../../utils/apiResponse');

exports.createPreference = async (req, res) => {
    const { name, tier, parentPC, pcCode, displayType } = req.body;
    
    //To check against empty fields
    if(!name || !tier || !pcCode || !displayType ||
        name == '' || tier == '' || pcCode == '' || displayType == ''    
    ) 
        errorRes( res, 'Ensure all fields are filled' )
    try {
        // check if the parentPC is valid
        if(parentPC && parentPC != '') {
            const parentPreference = await PreferenceCenter.findByPk(parentPC)
            if(!parentPreference)errorRes( res, 'Invalid Parent Preference Center Input.')
        }
        
        //check if there is a duplicate in the database
        const checkPreference = await PreferenceCenter.findOne({ 
            where: { name } 
        });
        if( checkPreference ) {
            errorRes( res, 'This Preference Center already exists in the database.' );
        } else {
        
            const preference = await PreferenceCenter.create({ 
                name, tier, parentPC: (parentPC == '')? null : parentPC, pcCode, displayType 
            });

            const data = await preference;

            //Success response
            successResWithData( res, 'Preference created successfully.', data );
        }
    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Preference creation is Unsuccessful.')
    }
};

exports.updatePreference = async (req, res) => {
    const { name, tier, parentPC, pcCode, displayType } = req.body;
    
    //To check against empty fields
    if(!name || !tier || !pcCode || !displayType ||
        name == '' || tier == '' || pcCode == '' || displayType == ''    
    ) 
        errorRes( res, 'Ensure all fields are filled' )
    try {
        // check if the parentPC is valid
        if(parentPC && parentPC != '') {
            const parentPreference = await PreferenceCenter.findByPk(parentPC)
            if(!parentPreference)errorRes( res, 'Invalid Parent Preference Center Input.')
        };

        //check if there is a duplicate in the database
        const checkPreference = await PreferenceCenter.findOne({ 
            where: { name } 
        });

        if(checkPreference && checkPreference.id != req.params.preferenceId) {
            errorRes( res, 'This Preference already exists in the database.' );
            
        } else {
    
            await PreferenceCenter.update({ 
                name, tier, parentPC: (parentPC == '')? null : parentPC, pcCode, displayType
            },{
                where: { id: req.params.preferenceId }
            });

            const preference = await PreferenceCenter.findByPk( req.params.preferenceId )

            const data = await preference;

            //Success response
            successResWithData( 
                res, 
                'Preference updated successfully.', 
                data 
            );
        }

    } catch (error) {
        console.log(error);
        errorLog( res, 'Preference Center Update is Unsuccessful.')
    }
};

exports.deletePreference = async (req, res) => {
    try {
        //check if the id is valid
        const checkPreference = await PreferenceCenter.findByPk( req.params.preferenceId )
        if(!checkPreference) return errorRes( res, 'Invalid Entry Details' );

        await PreferenceCenter.destroy({ where: { id: req.params.preferenceId } })

        //Success Response
        successRes( res, 'Preference Center deleted Successfully.' )

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

        //Success Response
        const data = await preference
        successResWithData( res, 'Preference Center Details', data );

    } catch (error) {
        console.log(error);
        errorLog(
            res, 
            'Error: Something went wrong.'
        )
    }
};

exports.getAllPreference = async (req, res) => {
    console.log('preference list controller');
    try {
        const preferenceList = await PreferenceCenter.findAll();

        const data = await preferenceList
        successResWithData( res,'Preference Center List', data )

    } catch (error) {
        console.log(error);
        errorLog( res, 'Error: Something went wrong.' )
    }
};