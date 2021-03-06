const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const app = express();
const port = 3000;

app.use(morgan("dev"))
app.use(express.json())

app.use((req, res, next) => {
  console.log("Hello from the middleware! 😊 ")
  req.addedValue = "I am a clown haha"
  next()
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours
    }
  })
}

const getTour =  (req, res) => {
  const id = req.params.id*1;
  const tour = tours.find(el => el.id === id);

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID"
    })
  }

  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  })
}

const createTour =  (req, res) => {
  console.log(req.body)
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour
      }
    })
  })
}

const updateTour =  (req, res) => {
  if (req.params.id*1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID"
    })
  }
  
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated> Tour here </Updated>"
    }
  })
}

const deleteTour =  (req, res) => {
  if (req.params.id*1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID"
    })
  }
  
  res.status(204).json({
    status: "success",
    data: null
  })
}

// app.get("/api/v1/tours", getAllTours)
// app.get("/api/v1/tours/:id", getTour)
// app.post("/api/v1/tours", createTour)
// app.patch("/api/v1/tours/:id", updateTour)
// app.delete("/api/v1/tours/:id", deleteTour)

app.route("/api/v1/tours")
  .get(getAllTours)
  .post(createTour)

app.route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)

app.listen(port, () => {
  console.log(`App is up and running on port ${port}`)
})

app.post("/", (req, res) => {
  res.status(200).json({message: "Hello"})
})