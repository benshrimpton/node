/**
 * Created by tebesfinwo on 7/23/14.
 */
'use strict';

module.exports = function(app){

    var magento = require('../../app/controllers/magento');

    //to synchronize magento store
    app
        .route('/magento/sync/store')
        .get(magento.syncStore);

    //to synchronize magento directory, which includes country and region
    app
        .route('/magento/sync/directory')
        .get(magento.syncCountryRegion);

    //Retrieve all of the country and its regions
    app
        .route('/magento/directory/country')
        .get(magento.getCountryRegion);

    //Retrieve all of regions using countryId.
    app
        .route('/magento/directory/region/:countryId')
        .get(magento.getRegionByCountryId);

    /*
    * All routes above need to be authorize
    * **/

};