const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    genre: [
      {
        type: String,
        required: [true, "At least one genre is required"],
        trim: true,
      },
    ],
    releaseYear: {
      type: Number,
      required: [true, "Release year is required"],
      min: [1888, "Release year must be after 1888"],
      max: [
        new Date().getFullYear() + 5,
        "Release year cannot be more than 5 years in the future",
      ],
    },
    director: {
      type: String,
      required: [true, "Director is required"],
      trim: true,
      maxlength: [100, "Director name cannot exceed 100 characters"],
    },
    cast: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        character: {
          type: String,
          trim: true,
        },
      },
    ],
    synopsis: {
      type: String,
      required: [true, "Synopsis is required"],
      maxlength: [2000, "Synopsis cannot exceed 2000 characters"],
    },
    posterUrl: {
      type: String,
      required: [true, "Poster URL is required"],
    },
    trailerUrl: {
      type: String,
      default: "",
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number, // in minutes
      required: [true, "Duration is required"],
    },
    language: {
      type: String,
      required: [true, "Language is required"],
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

movieSchema.index({ title: "text", synopsis: "text" });
movieSchema.index({ genre: 1, releaseYear: -1, averageRating: -1 });

module.exports = mongoose.model("Movie", movieSchema);
