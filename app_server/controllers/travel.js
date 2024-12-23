const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const tripsEndpoint = "http://localhost:3000/api/trips";
const options = {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
};

const formatCurrency = (amount) => `$${parseFloat(amount).toFixed(2)}`;
const formatDate = (date) => new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
});
/* GET travel view */
const travel = async function (req, res, next) {
    try {
        const response = await fetch(tripsEndpoint, options);
        let trips = await response.json(); // Ensure trips is initialized here

        // Check if trips is an array, otherwise assign an empty array
        if (!(trips instanceof Array)) {
            trips = [];
        }

        // Map trips to add a default category if not present
        trips = trips.map(trip => ({ 
            ...trip, 
            start: formatDate(trip.start),
            perPerson: formatCurrency(trip.perPerson),
            category: trip.category || 'beaches' // Default category
        }));

        let message = null;
        if (!trips.length) {
            message = 'No trips exist in our database!';
        }

        res.render('travel', { title: 'Travlr Getaways', trips, message, page: 'travel' });
    } catch (err) {
        console.error("Error fetching trips:", err);
        res.status(500).send(err.message);
    }
};

/* GET trip details */
const getTripDetails = async function (req, res, next) {
    const tripCode = req.params.tripCode; // Extract tripCode from route parameters
    try {
        //console.log(`Fetching trip details for tripCode: ${tripCode}`);
        const response = await fetch(`${tripsEndpoint}/${tripCode}`, options);
        let tripDetails = await response.json();

        //console.log("API Response for Trip Details:", tripDetails);

        // Handle array responses
        if (Array.isArray(tripDetails) && tripDetails.length > 0) {
            tripDetails = tripDetails[0]; // Extract the first element
        }

       
        if (!tripDetails || tripDetails.error) {
            console.error("Trip not found or invalid response from API");
            return res.status(404).render('error', { 
                title: 'Error', 
                message: 'Trip not found!' 
            });
        }

        // // Log data being passed to the template
        // console.log("Data being passed to Handlebars template:", {
        //     title: tripDetails.name,
        //     trip: tripDetails,
        //     page: 'tripDetails',
        // });

        // Pass the extracted trip details to the template
        res.render('tripDetails', {
            title: tripDetails.name,
            trip: tripDetails,
            page: 'tripDetails',
        });
    } catch (err) {
        console.error("Error fetching trip details:", err);
        res.status(500).render('error', { 
            title: 'Error', 
            message: 'Failed to load trip details.' 
        });
    }
};



module.exports = {
    travel,
    getTripDetails
};
