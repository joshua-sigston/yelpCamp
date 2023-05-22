const mongoose = require('mongoose');
const axios = require('axios');
const Campground = require('../models/campground');
const Cities = require('./cities');
const { places, descriptors} = require('./seedHelpers');
const { json } = require('express');

const APIKey = 'oBMRQylpLI6uL1Nzmh1190LXyFNXSnKmhoxo3PJhEkG6V400lABqnFVs';

async function seedImg(random10) {
    const randomNum = Math.floor(Math.random() * 50) + 1
    try {
        const res = await axios.get('https://api.pexels.com/v1/search?query=camping&per_page=50', {
            headers: {
                Accept: "application/json",
                Authorization: APIKey
            },
            params: {
                query: 'camping'
            }
 
        })
        // console.log(res.data.photos[randomNum].src.medium);
        return res.data.photos[randomNum].src.medium;
    }
    catch(err) {
        console.log(err);
    }
}

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('connection successfull!')
    })
    .catch(err => {
        console.log(err)
    });

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Campground.deleteMany();
    for (let i =0; i< 50; i++) {
        const randomNum = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author:'646a679fe9fe48a6ec6ee335',
            location:`${Cities[randomNum].city}, ${Cities[randomNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: await seedImg(),
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias architecto corporis iusto repellendus sint est culpa laborum vitae, velit ut!',
            price
        });
        await camp.save()
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});