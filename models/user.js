const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    username: String,
    email: {
           type: String,
           required: true
    },
    favourites: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing",
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
