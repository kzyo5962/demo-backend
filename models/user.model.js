const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');


const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            min: 6,
            max: 255
        },
        password: {
            type: String,
            require: true
        },

    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);