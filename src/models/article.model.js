import mongoose from "mongoose";

const ARTICLE_TAGS = ["research", "patnership", "acheivement", "event"];

const articleSchema = new mongoose.Schema(
  {
    featuredImage: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readTime: {
      type: Number,
      required: false,
    },
    tag: {
      type: String,
      enum: ARTICLE_TAGS,
      required: true,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } }
);

// Calculate read time before saving (average 200 words/minute)
articleSchema.pre("save", function (next) {
  if (this.text) {
    const words = this.text.trim().split(/\s+/).length;
    this.readTime = Math.ceil(words / 200);
  }
});

const Article = mongoose.model("Article", articleSchema);
export default Article;
