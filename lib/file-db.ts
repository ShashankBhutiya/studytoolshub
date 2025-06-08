import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs"; // Replace bcrypt with bcryptjs for better compatibility
import { v4 as uuid } from "uuid";

// Define the data directory
const DATA_DIR = path.join(process.cwd(), "data")

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Define file paths for each collection
const USERS_FILE = path.join(DATA_DIR, "users.json")
const TOOLS_FILE = path.join(DATA_DIR, "tools.json")
const FORUM_POSTS_FILE = path.join(DATA_DIR, "forum-posts.json")
const FORUM_COMMENTS_FILE = path.join(DATA_DIR, "forum-comments.json")
// Initialize files if they don't exist
const initializeFile = (filePath: string, defaultData: any[] = []): void => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2))
  }
}

// Initialize all data files
initializeFile(USERS_FILE)
initializeFile(TOOLS_FILE)
initializeFile(FORUM_POSTS_FILE)
initializeFile(FORUM_COMMENTS_FILE)

interface User {
  _id: string;
  name: string;
  [key: string]: any;
}

interface ForumPost {
  _id: string;
  author: string;
  likes: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

const readData = <T>(filePath: string): T[] => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
};
const writeData = <T>(filePath: string, data: T[]): void => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
  }
};
 

// User model operations
export const userModel = {
  findOne: async (query: any) => {
    const users = readData<any>(USERS_FILE);
    return users.find((user: any) => {
      for (const key in query) {
        if (user[key] !== query[key]) {
          return false
        }
      }
      return true
    }) || null
  },
  
  findById: async (id: string) => {
    const users = readData<any>(USERS_FILE)
    return users.find((user: any) => user._id === id) || null
  },
  
  find: async (query: any = {}) => {
    const users = readData<any>(USERS_FILE)
    if (Object.keys(query).length === 0) {
      return users
    }
    
    return users.filter((user: any) => {
      for (const key in query) {
        if (user[key] !== query[key]) {
          return false
        }
      }
      return true
    })
  },
  
  create: async (userData: any) => {
    const users = readData<any>(USERS_FILE)
    const newUser = {
      _id: uuid(),
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    users.push(newUser)
    writeData(USERS_FILE, users)
    return newUser
  },
  
  findByIdAndUpdate: async (id: string, updateData: any) => {
    const users = readData<any>(USERS_FILE)
    const userIndex = users.findIndex((user: any) => user._id === id)
    
    if (userIndex === -1) {
      return null
    }
    
    const updatedUser = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    users[userIndex] = updatedUser
    writeData(USERS_FILE, users)
    return updatedUser
  }
}

// Tool model operations
export const toolModel = {
  find: async (query: any = {}) => {
    const tools = readData<any>(TOOLS_FILE)
    
    if (Object.keys(query).length === 0) {
      return tools
    }
    
    return tools.filter((tool: any) => {
      for (const key in query) {
        if (key === '$or') {
          // Handle $or operator\
          const orConditions = query[key]
          return orConditions.some((condition: any) => {
            for (const condKey in condition) {
              if (condKey.includes('$regex')) {
                const regex = new RegExp(condition[condKey].$regex, condition[condKey].$options || '')
                return regex.test(tool[condKey.split('.')[0]])
              }
            }
            return false
          })
        } else if (key === 'platforms' || key === 'bestFor') {
          // Handle array contains\
          if (query[key].$in) {
            return tool[key].some((val: string) => query[key].$in.includes(val))
          }
        } else if (tool[key] !== query[key]) {
          return false
        }
      }
      return true
    })
  },

  findById: async (id: string) => {
    const tools = readData(TOOLS_FILE);
    return tools.find((tool: any) => tool._id === id) || null;
  },

  create: async (toolData: any) => {
    const tools = readData(TOOLS_FILE);
    const newTool = {
      _id: uuid(),
      ...toolData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tools.push(newTool);
    writeData(TOOLS_FILE, tools);
    return newTool;
  },

  insertMany: async (toolsData: any[]) => {
    const tools = readData(TOOLS_FILE);
    const newTools = toolsData.map((tool: any) => ({
      _id: uuid(),
      ...tool,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    
    tools.push(...newTools);
    writeData(TOOLS_FILE, tools);
    return newTools;
  },
  
    deleteMany: async () => {
      writeData(TOOLS_FILE, []);
      return { acknowledged: true, deletedCount: 0 };
    }
  }
  
  // Forum post model operations
  export const forumPostModel = {
    find: async (query: any = {}) => {
      const users = readData<User>(USERS_FILE);
      const posts = readData(FORUM_POSTS_FILE);
      
      if (Object.keys(query).length === 0) {
        return posts.map((post: any) => {
          const author = users.find((user: any) => user._id === post.author);
          return {
            ...post,
            author: author ? { _id: author._id, name: author.name } : { _id: post.author, name: 'Unknown' }
          }
        });
      }
    
    return posts
      .filter((post: any) => {
        for (const key in query) {
          if (key === '$or') {
            // Handle $or operator
            const orConditions = query[key]
            return orConditions.some((condition: any) => {
              for (const condKey in condition) {
                if (condKey.includes('$regex')) {
                  const regex = new RegExp(condition[condKey].$regex, condition[condKey].$options || '')
                  return regex.test(post[condKey.split('.')[0]])
                }
              }
              return false
            })
          } else if (post[key] !== query[key]) {
            return false
          }
        }
        return true
      })
      .map((post: any) => {
        const author = users.find((user: any) => user._id === post.author)
        return {
          ...post,
          author: author ? { _id: author._id, name: author.name } : { _id: post.author, name: 'Unknown' }
        }
      })
  },
  
  findById: async (id: string) => {
    const posts = readData(FORUM_POSTS_FILE)
    return posts.find((post: any) => post._id === id) || null
  },
  
  create: async (postData: { author: string; [key: string]: any }) => {
    const posts = readData(FORUM_POSTS_FILE)
    const users = readData<User>(USERS_FILE)
    const newPost = {
      _id: uuid(),
      ...postData,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    posts.push(newPost)
    writeData(FORUM_POSTS_FILE, posts)
    const author = users.find((user: any) => user._id === newPost.author)
    return {
      ...newPost,
      author: author ? { _id: author._id, name: author.name } : { _id: newPost.author, name: 'Unknown' }
    }
  },
  
  save: async (post: ForumPost) => {
    const posts = readData(FORUM_POSTS_FILE)
    const postIndex = posts.findIndex((p: any) => p._id === post._id)
    
    if (postIndex === -1) {
      return null
    }
    
    posts[postIndex] = {
      ...post,
      updatedAt: new Date().toISOString()
    }
    
    writeData(FORUM_POSTS_FILE, posts)
    return posts[postIndex]
  }
}

// Forum comment model operations
 const forumCommentModel = {
  find: async (query: { [key: string]: any } = {}) => {
    const comments = readData<{ [key: string]: any }>(FORUM_COMMENTS_FILE)
    
    if (Object.keys(query).length === 0) {
      return comments
    }
    
    return comments.filter((comment) => {
      for (const key in query) {
        if (comment[key] !== query[key]) {
          return false
        }
      }
      return true
    })
  },
  
  create: async (commentData: any) => {
    const comments = readData(FORUM_COMMENTS_FILE)
    const newComment = {
      _id: uuid(),
      ...commentData,
      likes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    comments.push(newComment)
    writeData(FORUM_COMMENTS_FILE, comments)
    return newComment
  }
}

// Helper function to seed initial admin user
 const seedAdminUser = async () => {
  const users = readData(USERS_FILE)
  
  // Check if admin exists
  const adminExists = users.some((user: any) => user.role === 'ADMIN')
    const hashedPassword = await bcrypt.hash('admin123', 12);
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 12)
    const adminUser = {
      _id: uuid(),
      name: 'Admin User',
      email: 'admin@studytoolshub.com',
      password: hashedPassword,
      role: 'ADMIN',
      subscriptionStatus: 'ACTIVE',
      preparingFor: 'BOTH',
      razorpayCustomerId: 'cust_admin',
      trialStartDate: new Date().toISOString(),
      subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    users.push(adminUser)
    writeData(USERS_FILE, users)
    console.log('Admin user created successfully')
  }
}

// Call seedAdminUser to ensure an admin user exists
seedAdminUser()
