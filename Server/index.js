const express = require("express");
const cors = require("cors");
require("dotenv").config();
const admin = require("firebase-admin");
// stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

const decoded = Buffer.from(process.env.FIREBASE_ADMIN_SDK, "base64").toString(
  "utf8"
);
const serviceAccount = JSON.parse(decoded);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.odubfg0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// test
app.get("/test", (req, res) => {
  res.json({ status: "success" });
});
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // =======================================================================

    const postsCollection = client.db("threadup").collection("posts");
    const userCollection = client.db("threadup").collection("user");
    const commentCollection = client.db("threadup").collection("comment");
    const tagCollection = client.db("threadup").collection("tag");
    const announcementCollection = client
      .db("threadup")
      .collection("announcement");

    // ------------------------- Custom Middlewares ------------------------------------
    const verifyFBToken = async (req, res, next) => {
      const authHeader = req.headers.authorization;
      console.log("This is auth Header", authHeader);
      if (!authHeader) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).send({ message: "unauthorized access" });
      }

      // verify the token
      try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.decoded = decoded;
        next();
      } catch (error) {
        return res.status(403).send({ message: "forbidden access" });
      }
    };

    // ------------------------- Stripe API ------------------------------------
    // Create payment intent
    app.post("/create-payment-intent", async (req, res) => {
      try {
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          automatic_payment_methods: {
            enabled: true,
          },
        });

        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        console.error("Stripe error:", error);
        res.status(400).json({ error: error.message });
      }
    });

    // ------------------------ Number => API-----------------------------------------
    app.get("/get-number", async (req, res) => {
      try {
        // Count number of posts
        const postCount = await postsCollection.countDocuments();

        // Count total number of comments in all posts
        const posts = await postsCollection
          .find({}, { projection: { comments: 1 } })
          .toArray();
        const commentCount = posts.reduce(
          (acc, post) =>
            acc + (Array.isArray(post.comments) ? post.comments.length : 0),
          0
        );

        // Count number of users
        const userCount = await userCollection.countDocuments();

        res.status(200).json({
          postCount,
          commentCount,
          userCount,
        });
      } catch (error) {
        console.error("Error getting numbers:", error);
        res.status(500).json({ error: "Failed to get numbers" });
      }
    });
    // ------------------------ Tags API-----------------------------------------
    // Create a new tag
    app.post("/tags", async (req, res) => {
      try {
        const tag = req.body;
        const result = await tagCollection.insertOne(tag);
        res.status(201).json({ success: true, result });
      } catch (error) {
        console.error("Error creating tag:", error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Get all tags
    app.get("/tags", async (req, res) => {
      try {
        const tags = await tagCollection.find({}).toArray();
        res.status(200).json({ success: true, tags });
      } catch (error) {
        console.error("Error fetching tags:", error);
        res.status(500).json({ success: false, error: error.message });
      }
    });
    // ------------------------ Announcement API-----------------------------------------
    // Create a new announcement
    app.post("/announcements", async (req, res) => {
      try {
        const announcement = req.body;
        const result = await announcementCollection.insertOne(announcement);
        res.status(201).json({ success: true, result });
      } catch (error) {
        console.error("Error creating announcement:", error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Get the latest announcement
    app.get("/latest-announcement", async (_req, res) => {
      try {
        const latestAnnouncement = await announcementCollection
          .find()
          .sort({ createdAt: -1 })
          .limit(1)
          .toArray();

        res.status(200).send(latestAnnouncement);
      } catch (error) {
        console.error("Error fetching latest announcement:", error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Get all announcements
    app.get("/announcements", async (req, res) => {
      try {
        const announcements = await announcementCollection
          .find({})
          .sort({ createdAt: -1 })
          .toArray();
        res.status(200).json({ success: true, announcements });
      } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ success: false, error: error.message });
      }
    });
    // ------------------------ User API-----------------------------------------

    app.post("/users", async (req, res) => {
      const { uid, email } = req.body;

      try {
        const existing = await userCollection.findOne({ uid });
        if (existing) {
          return res.status(200).send({ message: "User already exists" });
        }

        const newUser = await userCollection.insertOne(req.body);
        res.status(201).send(newUser);
      } catch (err) {
        res.status(500).send({ error: err.message });
      }
    });

    app.post("/update-user", async (req, res) => {
      const { email } = req.body;
      console.log("Updating user with email:", email);

      if (!email) {
        return res.status(400).json({
          success: false,
          error: "Email is required",
        });
      }

      try {
        const updateData = {
          role: "member",
          badge: "gold",
          isMember: true,
        };

        const result = await userCollection.updateOne(
          { email: email },
          { $set: updateData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({
            success: false,
            error: "User not found",
          });
        }

        if (result.modifiedCount === 0) {
          return res.status(200).json({
            success: true,
            message: "User already has these values",
          });
        }

        console.log("User updated successfully:", email);
        res.status(200).json({
          success: true,
          message: "User updated to premium member successfully",
          updatedFields: updateData,
        });
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
          success: false,
          error: "Internal server error",
        });
      }
    });

    // get all the users
    app.get("/all-user", async (req, res) => {
      try {
        let query = {};

        const users = await userCollection
          .find(query)
          .sort({ createdAt: -1 })
          .toArray();

        res.status(200).json({
          success: true,
          users: users,
          count: users.length,
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
          success: false,
          error: "Failed to fetch users",
        });
      }
    });

    // get a user post number
    app.get("/user-post-count", async (req, res) => {
      const { email } = req.query;

      if (!email) {
        return res
          .status(400)
          .json({ success: false, error: "Email is required" });
      }

      try {
        const count = await postsCollection.countDocuments({
          authorEmail: email,
        });
        res.status(200).json({ success: true, postCount: count });
      } catch (error) {
        console.error("Error getting user post count:", error);
        res
          .status(500)
          .json({ success: false, error: "Failed to get post count" });
      }
    });

    // make a user admin
    app.patch("/make-admin/:id", async (req, res) => {
      const { id } = req.params;
      try {
        // Check if user exists and is not already an admin
        const user = await userCollection.findOne({ _id: new ObjectId(id) });

        if (!user) {
          return res.status(404).json({
            success: false,
            error: "User not found",
          });
        }

        if (user.isAdmin === true) {
          return res.status(200).json({
            success: true,
            message: "User is already an admin",
          });
        }

        // Update user to admin
        const updateData = {
          isAdmin: true,
          role: "admin",
        };

        const result = await userCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (result.modifiedCount === 0) {
          return res.status(500).json({
            success: false,
            error: "Failed to update user",
          });
        }

        console.log("User promoted to admin successfully:", id);
        res.status(200).json({
          success: true,
          message: "User promoted to admin successfully",
          updatedFields: updateData,
        });
      } catch (error) {
        console.error("Error making user admin:", error);
        res.status(500).json({
          success: false,
          error: "Internal server error",
        });
      }
    });

    // GET /api/users/:uid
    app.get("/user/:uid", async (req, res) => {
      const uid = req.params.uid;

      try {
        const user = await userCollection.findOne({ uid });
        if (!user) return res.status(404).send({ message: "User not found" });
        res.send(user);
      } catch (err) {
        res.status(500).send({ error: err.message });
      }
    });

    // ------------------------ Posts API-----------------------------------------
    // post api for post
    app.post("/posts", async (req, res) => {
      try {
        const post = req.body;
        const result = await postsCollection.insertOne(post);
        res.status(201).json({ success: true, result });
      } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Get a specific post
    app.get("/posts/:id", async (req, res) => {
      const { id } = req.params;
      const result = await postsCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // Search posts by title or description
    app.get("/post/search", async (req, res) => {
      try {
        const { search = "" } = req.query;

        const query = {};

        // Only filter by search text in title or description
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ];
        }

        const posts = await postsCollection
          .find(query)
          .sort({ createdAt: -1 })
          .toArray();

        res.status(200).json({ success: true, posts });
      } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Route: GET /posts/user?email=user@example.com
    app.get("/my-posts", async (req, res) => {
      const { email } = req.query;

      if (!email) {
        return res
          .status(400)
          .json({ success: false, error: "Email is required" });
      }

      try {
        const result = await postsCollection
          .find({ authorEmail: email })
          .sort({ createdAt: -1 })
          .toArray();

        console.log("Found posts:", result.length);
        res.status(200).json({ success: true, posts: result });
      } catch (error) {
        console.error("Error fetching posts:", error);
        res
          .status(500)
          .json({ success: false, error: "Internal server error" });
      }
    });

    // Route: GET 3 posts /posts/user?email=user@example.com
    app.get("/three-posts", async (req, res) => {
      const { email } = req.query;

      if (!email) {
        return res
          .status(400)
          .json({ success: false, error: "Email is required" });
      }

      try {
        const result = await postsCollection
          .find({ authorEmail: email })
          .limit(3)
          .sort({ createdAt: -1 })
          .toArray();

        console.log("Found posts:", result.length);
        res.status(200).json({ success: true, posts: result });
      } catch (error) {
        console.error("Error fetching posts:", error);
        res
          .status(500)
          .json({ success: false, error: "Internal server error" });
      }
    });

    app.delete("/delete/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid ID format" });
      }

      try {
        const query = { _id: new ObjectId(id) };
        const result = await postsCollection.deleteOne(query);

        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Post not found" });
        }

        res.send({ message: "Post deleted successfully", deletedId: id });
      } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).send({ error: "Internal Server Error" });
      }
    });

    // update upvote
    app.patch("/posts/upvote/:id", async (req, res) => {
      const { id } = req.params;
      // console.log("im clicked",id);
      const result = await postsCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        { $inc: { upVote: 1 } }
      );
      res.json({ message: "Upvoted successfully" });
    });

    // update downvote
    app.patch("/posts/downvote/:id", async (req, res) => {
      const { id } = req.params;
      const result = await postsCollection.updateOne(
        {
          _id: new ObjectId(id),
        },
        { $inc: { downVote: 1 } }
      );
      res.json({ message: "Upvoted successfully" });
    });

    // POST /posts/:id/comments
    app.post("/posts/:id/comments", async (req, res) => {
      const { id } = req.params;
      const { content, authorImage, authorName, createdAt } = req.body;

      console.log("text", id, content, authorImage, authorName);

      const result = await postsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $push: { comments: { content, authorName, authorImage, createdAt } } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.status(200).json({
        message: "Comment added successfully",
        comment: content,
      });
    });

    // ------------------------ Reported Comments API-----------------------------------------

    app.post("/report-comment", async (req, res) => {
      try {
        const reportData = req.body;
        console.log("Reporting comment:", reportData);

        const { postId, commentId } = reportData;

        // Check if required fields are provided
        if (!postId || !commentId) {
          return res.status(400).json({
            success: false,
            error: "postId and commentId are required",
          });
        }

        // Check if this comment from this post is already reported
        const existingReport = await commentCollection.findOne({
          postId: postId,
          commentId: commentId,
        });

        if (existingReport) {
          return res.status(409).json({
            success: false,
            message: "This comment has already been reported",
            existingReportId: existingReport._id,
          });
        }

        // Add timestamp when the report was created
        const reportedComment = {
          ...reportData,
          reportedAt: new Date(),
          status: "pending",
        };

        const result = await commentCollection.insertOne(reportedComment);

        console.log("Comment report saved successfully:", result.insertedId);

        res.status(201).json({
          success: true,
          message: "Comment reported successfully",
          reportId: result.insertedId,
        });
      } catch (error) {
        console.error("Error reporting comment:", error);
        res.status(500).json({
          success: false,
          error: "Failed to report comment",
        });
      }
    });

    // Get all reported comments (for admin)
    app.get("/reported-comments", async (req, res) => {
      try {
        const { status } = req.query; // Filter by status if provided
        let query = {};

        if (status) {
          query.status = status;
        }

        const reportedComments = await commentCollection
          .find(query)
          .sort({ reportedAt: -1 })
          .toArray();

        res.status(200).json({
          success: true,
          reports: reportedComments,
          count: reportedComments.length,
        });
      } catch (error) {
        console.error("Error fetching reported comments:", error);
        res.status(500).json({
          success: false,
          error: "Failed to fetch reported comments",
        });
      }
    });

    // Delete a reported comment by its report ID when keep is clicked
    app.delete("/reported-comments/:id", async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid report ID" });
      }

      try {
        const result = await commentCollection.deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Reported comment not found" });
        }

        res.status(200).json({
          success: true,
          message: "Reported comment deleted successfully",
          deletedId: id,
        });
      } catch (error) {
        console.error("Error deleting reported comment:", error);
        res
          .status(500)
          .json({ success: false, error: "Failed to delete reported comment" });
      }
    });

    // Delete a reported comment by its report ID when delete is clicked
    app.delete(
      "/reported-comments/delete/:id",

      async (req, res) => {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res
            .status(400)
            .json({ success: false, error: "Invalid report ID" });
        }

        try {
          // First, find the report to get postId and commentId
          const report = await commentCollection.findOne({
            _id: new ObjectId(id),
          });
          console.log("Found report:", report);

          if (!report || !report.postId) {
            return res
              .status(404)
              .json({ success: false, message: "Report not found" });
          }

          // Find the post to verify it exists
          const post = await postsCollection.findOne({
            _id: new ObjectId(report.postId),
          });

          if (!post) {
            return res
              .status(404)
              .json({ success: false, message: "Post not found" });
          }

          // Remove the comment with the given commentId (which is actually the index) from the post's comments array
          const commentIndex = parseInt(report.commentId);

          // Verify the comment exists at this index
          if (
            !post.comments ||
            commentIndex < 0 ||
            commentIndex >= post.comments.length
          ) {
            return res.status(404).json({
              success: false,
              message: "Comment not found at the specified index",
            });
          }

          // Remove the comment at the specific index using $unset and $pull
          const updateResult = await postsCollection.updateOne(
            { _id: new ObjectId(report.postId) },
            { $unset: { [`comments.${commentIndex}`]: 1 } }
          );

          // Remove the null element created by $unset
          await postsCollection.updateOne(
            { _id: new ObjectId(report.postId) },
            { $pull: { comments: null } }
          );

          // Only delete the report if the comment was successfully removed from the post
          if (updateResult.acknowledged) {
            const deleteResult = await commentCollection.deleteOne({
              _id: new ObjectId(id),
            });

            if (deleteResult.deletedCount === 0) {
              return res
                .status(404)
                .json({ success: false, message: "Failed to delete report" });
            }

            res.status(200).json({
              success: true,
              message: "Comment and report deleted successfully",
              deletedReportId: id,
              commentRemovedFromPost: updateResult.modifiedCount > 0,
            });
          } else {
            res.status(500).json({
              success: false,
              error: "Failed to remove comment from post",
            });
          }
        } catch (error) {
          console.error("Error deleting reported comment:", error);
          res.status(500).json({
            success: false,
            error: "Failed to delete reported comment",
          });
        }
      }
    );

    // =======================================================================

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Example API route
app.get("/", (req, res) => {
  res.send("I am Awake!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
