
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const { redirect } = require('react-router-dom');
// mongoose.set('strictQuery', true)
const dotenv = require('dotenv')
dotenv.config()

const app = express()



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public")) // to access public files, telling express explicitly else it'll ignore

mongoose.connect(process.env.DBURI)

// schema
const itemsSchema = {
    name: String
}

// model
const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
    name: "welcome to todo List"
})
const item2 = new Item({
    name: "Hit the + to add new items"
})
const item3 = new Item({
    name: "< Check here to delete items"
})

const defaultItems = [item1, item2, item3]

let today = new Date()
let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
}
let day = today.toLocaleDateString("en-US", options)


app.get('/', (req, res) => {
    // let day = date.getDate() // require here in app.js and exported from date.
    // let date = day.toISOString().slice(0, 10)
    // console.log(day)

    Item.find({}).then((foundItems) => {
        if (foundItems?.length === 0) {
            Item.insertMany(defaultItems)
                .then(function () {
                    console.log("Successfully saved default items to DB");
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
        res.render('list', { listTitle: day, newListItems: foundItems })
    })
})

app.post('/', (req, res) => {
    let itemName = req.body.newItem
    const item = new Item({
        name: itemName
    })
    item.save()
    res.redirect("/")
})

//delete
app.post("/delete", async (req, res) => {
    const checkedItemId = req.body.checkbox
    console.log(checkedItemId)
    try {
        await Item.findByIdAndRemove(checkedItemId)

        console.log("successfully deleted")

    } catch (err) {
        console.error(err);
    }
    res.redirect("/")



})



// update the todolist using checked button

// app.post("/update", async (req, res) => {
//     const linethroughItemId = req.body.linethroughItemId;
//     console.log(linethroughItemId);
//     try {
//         const item = await Item.findById(linethroughItemId);
//         // console.log(item);



//         if (item) {
//             // Toggle the "completed" state of the item
//             item.completed = !item.completed;

//             // Save the updated item to the database
//             await item.save();

//             console.log("Successfully updated");
//         } else {
//             console.log("Item not found");
//         }
//     } catch (err) {
//         console.error(err);
//     }
//     // res.redirect("/");
// });


// app.get('/work', (req, res) => {
//     res.render("list", { listTitle: "work List", newListItems: workItems })
// })

// app.post('/work', (req, res) => {
//     let item = req.body.newItem
//     workItems.push(item)
//     res.redirect('/work')

// })

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`listening on port ${PORT} `)

})