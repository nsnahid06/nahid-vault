# Nahid Vault

### A Modern Luxury Menswear E-Commerce Web Application

**Nahid Vault** is a modern full-stack luxury menswear e-commerce web application designed to provide a premium and seamless online shopping experience.

The platform allows users to explore curated menswear collections, search and filter products, view detailed product information, manage their shopping cart and wishlist, complete checkout, place orders, submit product reviews, and track their order history.

The application also includes an **AI Voice Stylist** powered by Google Gemini Live, providing an interactive AI-based fashion assistance experience.

---

## 🌐 Live Demo

**Live Website:**
https://nahid-vault.onrender.com/

---

## ✨ Features

* 🔐 User registration and authentication
* 🔑 User login, logout and password reset
* 🛍️ Luxury menswear product catalogue
* 🔎 Product search
* 🏷️ Category filtering
* 📊 Product sorting
* 📦 Stock availability filtering
* 👕 Product details and specifications
* 🎨 Size and colour selection
* 🛒 Shopping cart management
* ❤️ Wishlist functionality
* 🎟️ Promotional / discount codes
* 💳 Multiple payment method options
* 📋 Checkout and order placement
* 📦 Order history
* 🔍 Order search
* ⭐ Product reviews and ratings
* 🤖 AI Voice Stylist
* 📱 Responsive user interface
* 🔒 Firebase authentication and Firestore security rules

---

## 🛠️ Technology Stack

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js
* WebSocket

### Authentication

* Firebase Authentication

### Database

* Cloud Firestore

### AI

* Google Gemini Live API

### UI & Icons

* Lucide React

### Development & Deployment

* Vite
* Node.js
* Express
* Vercel / suitable hosting platform

---

## 🏗️ System Architecture

Nahid Vault follows a modern full-stack web architecture:

```text
                    ┌──────────────────────┐
                    │       USER           │
                    │   Web Browser        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      FRONTEND        │
                    │ React + TypeScript   │
                    │ Vite + Tailwind CSS  │
                    └───────┬───────┬──────┘
                            │       │
                ┌───────────┘       └──────────────┐
                ▼                                  ▼
     ┌─────────────────────┐             ┌─────────────────────┐
     │ Firebase Services   │             │ Node.js + Express   │
     │                     │             │                     │
     │ Authentication      │             │ WebSocket Server    │
     │ Cloud Firestore     │             │ AI Integration      │
     └──────────┬──────────┘             └──────────┬──────────┘
                │                                   │
                ▼                                   ▼
     ┌─────────────────────┐             ┌─────────────────────┐
     │ Orders & Reviews    │             │ Google Gemini Live  │
     │ User Authentication │             │ AI Voice Stylist    │
     └─────────────────────┘             └─────────────────────┘
```

### Architecture Flow

```text
User
  ↓
React Frontend
  ↓
Firebase Authentication / Firestore
  ↓
Orders & Reviews

React Frontend
  ↓
WebSocket
  ↓
Node.js + Express
  ↓
Google Gemini Live API
  ↓
AI Voice Stylist
```

---

## 👤 User Authentication

Nahid Vault uses **Firebase Authentication** for secure user authentication.

Users can:

* Create an account
* Log in
* Log out
* Reset their password
* Maintain an authenticated session

Authentication is integrated with the application's shopping and order workflow.

---

## 🛍️ Product Catalogue

The product catalogue contains curated menswear products organized into different categories.

Example categories include:

* Outerwear
* Formal Wear
* Casual Shirts
* Denim & Pants
* Footwear
* Accessories

Each product contains information such as:

* Product name
* Category
* Price
* Images
* Description
* Material
* Available sizes
* Available colours
* Stock information
* Rating

---

## 🔎 Search, Filter & Sort

Users can easily find products using multiple catalogue controls.

### Search

Products can be searched using information such as:

* Product title
* Category
* Material
* Description

### Filter

Users can filter products by:

* Category
* Stock availability

### Sort

Products can be sorted based on:

* Featured
* Price
* Rating

---

## 👕 Product Details

The product details interface provides comprehensive information about each product.

Users can:

* View product images
* Read product descriptions
* Check material information
* View fit and care information
* Select size
* Select colour
* Select quantity
* Add products to cart
* Add products to wishlist
* View customer reviews

---

## 🛒 Shopping Cart

The shopping cart allows users to manage selected products before checkout.

Users can:

* Add products
* Increase quantity
* Decrease quantity
* Remove products
* Clear the cart
* Apply promotional codes
* View subtotal
* View discount
* View shipping charge
* View tax
* View final total

---

## ❤️ Wishlist

The wishlist allows users to save products they are interested in for later.

Users can:

* Add products to wishlist
* Remove products from wishlist
* View saved products
* Move products to the shopping cart

---

## 🎟️ Promotional Codes

Nahid Vault supports promotional codes for selected discounts and offers.

Example promotional codes implemented in the application include:

```text
NVM66
STYLE10
GENTLEMAN20
FREESHIP
SUPER30
AUTUMN25
VAULTCLUB35
```

The applicable discount depends on the promotional code used.

---

## 💳 Checkout

The checkout system collects the information required to process an order.

### Shipping Information

* Full Name
* Email
* Phone Number
* Country
* Street Address
* City
* Postal Code

### Payment Methods

The application provides options such as:

* Credit Card
* Cash on Delivery
* Mobile Banking

The checkout process validates required information before an order can be placed.

---

## 📦 Order Management

After successful checkout, an order is created with a unique order identifier.

Order information includes:

* Order ID
* Customer information
* Ordered products
* Shipping information
* Payment method
* Subtotal
* Discount
* Tax
* Shipping fee
* Total amount
* Order creation date
* Estimated delivery information

Orders belonging to authenticated users are stored in **Cloud Firestore**.

---

## 📋 Order History

Authenticated users can access their previous orders through the order-history dashboard.

Users can:

* View previous orders
* Search orders
* Open individual order details
* View purchased products
* View shipping information
* View payment information
* View order totals

Orders can be searched using information such as:

* Order ID
* Customer name
* Email
* Phone number

---

## ⭐ Product Reviews

Users can submit reviews for products.

A review contains:

* Product ID
* User name
* Rating
* Comment
* Creation timestamp
* User ID

Reviews are stored in **Cloud Firestore** and displayed in the relevant product details section.

---

## 🤖 AI Voice Stylist

One of the main additional features of Nahid Vault is the **AI Voice Stylist**.

The feature uses:

* Web Audio API
* WebSocket communication
* Node.js / Express
* Google Gemini Live API

The AI Voice Stylist provides an interactive voice-based fashion assistance experience.

Users can interact with the stylist for topics such as:

* Outfit recommendations
* Suit combinations
* Clothing suggestions
* Size guidance
* Clothing care
* Fashion-related questions

### AI Architecture

```text
User Voice
    ↓
React Frontend
    ↓
WebSocket
    ↓
Node.js / Express Server
    ↓
Gemini Live API
    ↓
AI Response
    ↓
User
```

---

## 🔒 Security & Validation

Nahid Vault implements several security and validation mechanisms.

### Authentication

Firebase Authentication is used instead of manually storing user passwords.

### Firestore Security Rules

Firestore rules restrict access based on authenticated users.

For example:

* Users can access their own orders.
* Order creation requires authentication.
* The authenticated user's UID must match the order owner.
* Review creation requires authentication.
* Review ratings are validated.
* Review comments have length restrictions.

### Input Validation

The application validates important user inputs such as:

* Email
* Password
* Password confirmation
* Shipping information
* Phone number
* Postal code
* Payment information
* Review rating
* Review comment

---

## 🗄️ Database

Nahid Vault uses **Cloud Firestore** for persistent application data.

### Main Collections

```text
Firestore
│
├── orders
│
├── reviews
│
└── users
    └── {userId}
        └── wishlists
```

### Orders

Stores customer order information and purchased products.

### Reviews

Stores product reviews and ratings.

### Users / Wishlists

The Firestore security configuration supports user-specific wishlist documents.

---

## 📸 Screenshots

### Homepage

*Add homepage screenshot here.*

### Product Catalogue

*Add product catalogue screenshot here.*



## 📂 Project Structure

A simplified structure of the project is:

```text
nahid-vault/
│
├── components/
│   ├── Header
│   ├── Footer
│   ├── ProductCard
│   ├── ProductDetail
│   ├── CartDrawer
│   ├── Checkout
│   ├── Login
│   ├── Register
│   ├── OrderHistory
│   ├── AI Voice Stylist
│   └── ...
│
├── services/
│   ├── Firebase
│   ├── Firestore
│   └── AI services
│
├── server/
│   └── Express / WebSocket server
│
├── data/
│   └── Product data
│
├── App.tsx
├── index.tsx
├── package.json
├── vite.config.ts
├── firestore.rules
└── README.md
```

> The exact directory structure may vary depending on the final project version.

---



### 4. Configure Firebase

Create/configure the Firebase project and provide the required Firebase configuration for:

* Firebase Authentication
* Cloud Firestore

### 5. Configure Environment Variables

Add the required environment variables for the AI and backend services.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
```

> Never commit API keys, private keys, passwords, or other sensitive credentials to GitHub.

### 6. Run the Development Server

```bash
npm run dev
```

The application will then run on the local development server.

---

## 🚀 Deployment

The application can be deployed using a suitable hosting platform such as Vercel.

### Production Deployment

```text
Source Code
     ↓
GitHub Repository
     ↓
Vercel
     ↓
Live Web Application
```

---

## 🎯 Project Objective

The primary objective of Nahid Vault is to provide a modern, responsive and interactive online shopping experience for luxury menswear.

The project combines:

* Modern frontend development
* Cloud authentication
* Cloud database
* E-commerce functionality
* Secure data access
* Real-time communication
* Generative AI

into a single web application.

---

## 🔮 Future Improvements

Future versions of Nahid Vault could include:

* Full admin dashboard
* Product management CRUD
* Persistent product database
* Online payment gateway integration
* Real-time order status updates
* Advanced recommendation system
* AI-powered personalized product recommendations
* Customer support chat
* Advanced analytics
* Inventory management
* Product reviews with image uploads
* Mobile application

---

## 👨‍💻 Project Information

**Project Name:** Nahid Vault
**Project Type:** Full-Stack E-Commerce Web Application
**Domain:** Luxury Menswear / Fashion E-Commerce
**Frontend:** React + TypeScript + Vite
**Backend:** Node.js + Express
**Database:** Firebase Cloud Firestore
**Authentication:** Firebase Authentication
**AI:** Google Gemini Live API


