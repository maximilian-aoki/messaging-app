const express = require("express");
const router = express.Router();

const indexController = require("../controllers/indexController");
const roomController = require("../controllers/roomController");

// INDEX ROUTES

/* GET - all chat rooms for authed user */
router.get("/", indexController.getUserChatRooms);

/* GET/POST - sign-up */
router
  .route("/sign-up")
  .get(indexController.getSignUp)
  .post(indexController.postSignUp);

/* GET/POST - log-in */
router
  .route("/log-in")
  .get(indexController.getLogIn)
  .post(indexController.postLogIn);

// ROOM ROUTES

/* GET - all available users to create a chat room with for authed users */
router.get("/users", roomController.getAllUsers);

/* POST - create a new room and go to it */
router.post("/rooms/create", roomController.createRoom);

/* GET - a specific room and all its messages */
router.get("/rooms/:roomId", roomController.getRoom);

module.exports = router;
