'use strict';
const db = require('../db')

const addBarber = async (req, res, next) =>{
    try{
        const data = req.body;
        await db.collection("Barbers")
        .doc(data.userId)
        .set(data);
        res.send("Barber added successfully");
    }catch(err){
        res.status(400).send(err.message);
    }
}

const updateBarberWorkingDays = async (req, res, next) => {
    try {
      const uid = req.params.id;
      const data = req.body;
      await db
        .collection("Barbers")
        .doc(uid)
        .update({
          availableWorkHours: data.WorkingDays,
        })
        .then(() => {
          res.send("Barber N." + uid + " appointments updated!");
        });
    } catch (error) {
      res.status(400).send(err.message);
    }
}

const getBarberWorkingDays = async (req, res, next) => {
    const uid = req.params.id;
    var ans = [];
    try {
      await db
        .collection("Barbers")
        .get()
        .then((snapshot) => {
          snapshot.forEach((docSnapshot) => {
            if (docSnapshot.data().userId === uid) {
              ans = Object.keys(docSnapshot.data().availableWorkHours);
            }
          });
        });
    } catch (error) {
        res.status(400).send(`get barber workingDays failed, Error message:${error.message}`);
    }

    let list = ["Sun", "Mon", "Thu", "Wed", "Tue", "Fri", "Sat"];
    let difference = list.filter((x) => !ans.includes(x));

    res.send(difference);
};

const getBarber = async (req, res, next) => {
    const uid = req.params.id
    try{
        const userData = await db
            .collection("Barbers")
            .doc(uid)
            .get();
        res.send(userData.data());
    }catch(error){
        res.status(400).send(error.message);
    }
};

const updateFirstEntry = async (req, res, data) => {
    const uid = req.params.id
    await db
        .collection("Barbers")
        .doc(uid)
        .update({
            firstEntry: false,
        })
        .then(() => {
        res.send("Barber N.", uid, " First entry updated!");
        });
};

const getBarberList = async (req, res, data) => {
    let barbers = [];
    await db
      .collection("Barbers")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          const uid = documentSnapshot.data().userId;
          const name = documentSnapshot.data().userName;
          barbers.push({ label: name, value: uid });
        });
      })
      .catch((err) => {
        res.status(400).send(`error while geting barbers: ${err.message}`);
      });
    res.send(barbers);
};


module.exports = {
    addBarber,
    updateBarberWorkingDays, 
    getBarberWorkingDays, 
    getBarber,
    updateFirstEntry,
    getBarberList
}