# DNS Walkthrough

## Personal Website — DNS, CNAME, and Custom Domain Setup

### 1. Purpose

This document explains how DNS works for my personal website and how a future FlyRank subdomain such as:

```text
yourname.flyrank.ai
```

will be connected to my existing website.

My current portfolio is publicly deployed on **Vercel**:

```text
https://mussarat-web-dev.vercel.app/
```

The frontend is hosted on Vercel, while the backend/AI services are deployed separately on Hugging Face and integrated with the frontend through APIs.

The FlyRank subdomain will not require rebuilding or migrating the website. It will simply point a new domain name to the existing hosted application.

---

# 2. What is DNS?

**DNS (Domain Name System)** translates human-readable domain names into information that computers use to locate services on the internet.

For example, instead of remembering an IP address or a hosting endpoint, a user can enter:

```text
mussarat-web-dev.vercel.app
```

DNS helps the user's device determine where that website should be reached.

A simple way to think about DNS is:

```text
Human-readable domain
        ↓
       DNS
        ↓
Destination / hosting service
        ↓
Website
```

DNS is similar to a directory or lookup system for internet domain names.

---

# 3. What Happens When Someone Enters a Website Address?

When a user enters a domain into a browser, several steps occur before the website is displayed.

For example:

```text
https://mussarat-web-dev.vercel.app
```

The simplified flow is:

```text
User
  │
  ▼
Web Browser
  │
  ▼
DNS Resolver
  │
  ▼
DNS Nameserver
  │
  ▼
DNS Record
  │
  ▼
Hosting Destination
  │
  ▼
Vercel
  │
  ▼
Website
```

### Step 1 — User enters the domain

The user enters a website address into the browser.

Example:

```text
mussarat-web-dev.vercel.app
```

### Step 2 — Browser/Operating System checks cached information

The browser and operating system may already know the DNS information from a previous lookup.

If the information is not available or has expired, the request continues to a DNS resolver.

### Step 3 — DNS Resolver

The DNS resolver performs the lookup on behalf of the user's device.

The resolver may be operated by an ISP or another DNS provider.

Its job is to find the DNS information associated with the requested domain.

### Step 4 — Nameserver

The resolver communicates with the appropriate authoritative nameserver.

The authoritative nameserver contains the DNS records for the domain.

### Step 5 — DNS Record

The nameserver returns the relevant DNS record.

The record tells the resolver where the requested domain should point.

### Step 6 — Browser connects to the destination

The browser uses the returned information to establish a connection with the hosting service.

### Step 7 — Website is served

The hosting provider responds to the browser and the website is displayed to the user.

---

# 4. What is a CNAME Record?

A **CNAME (Canonical Name)** record is a DNS record that makes one domain name an alias for another domain name.

For example, a subdomain could have a CNAME record similar to:

```text
www.example.com → hosting.example.com
```

Instead of directly storing an IP address, the CNAME points the domain to another hostname.

This is useful when a hosting provider gives a hostname that should be used for a custom domain.

---

# 5. CNAME in My Future FlyRank Setup

After my capstone is approved, FlyRank will provision my personal subdomain.

For example:

```text
mussarat.flyrank.ai
```

The exact hostname/value will be provided by FlyRank during provisioning.

I will then add the custom domain inside my hosting provider's domain settings.

The conceptual setup will be:

```text
mussarat.flyrank.ai
        │
        ▼
DNS CNAME Record
        │
        ▼
Vercel-provided hostname
        │
        ▼
Vercel
        │
        ▼
My existing portfolio
```

The exact CNAME value should be taken from Vercel/FlyRank's actual domain configuration instructions rather than guessed.

---

# 6. Why I Do Not Need to Rebuild the Website

A domain name and a website deployment are separate things.

My website is already deployed on Vercel:

```text
https://mussarat-web-dev.vercel.app/
```

Adding:

```text
mussarat.flyrank.ai
```

does not require moving the application to another server.

Instead, the new domain becomes another way to reach the same deployed application.

Conceptually:

```text
Current URL
mussarat-web-dev.vercel.app
          │
          ▼
       Vercel
          │
          ▼
    Portfolio Website


Future URL
mussarat.flyrank.ai
          │
          ▼
      DNS / CNAME
          │
          ▼
       Vercel
          │
          ▼
    Portfolio Website
```

Therefore, the custom domain is primarily a **DNS and hosting configuration change**, not a code migration.

---

# 7. DNS Record vs Nameserver

These two concepts are related but different.

### Nameserver

A nameserver is responsible for answering DNS queries for a domain or zone.

It provides DNS information such as:

* A records
* AAAA records
* CNAME records
* MX records
* TXT records

### DNS Record

A DNS record is an individual piece of information stored in the DNS system.

For example:

```text
Type: CNAME
Name: www
Target: example.hosting-provider.com
```

The nameserver is responsible for serving the record; the record contains the actual routing information.

---

# 8. DNS Propagation

After a DNS record is changed, the change may not appear everywhere immediately.

DNS information is cached by resolvers and other systems according to the record's **TTL (Time to Live)**.

Therefore, after adding or changing a DNS record:

```text
DNS Record Updated
        ↓
Caching / Propagation
        ↓
Different DNS resolvers update
        ↓
Domain begins resolving to new destination
```

This is why a newly configured custom domain may take some time before it works consistently for everyone.

---

# 9. HTTPS and the Padlock

DNS itself does not provide HTTPS encryption.

DNS tells the browser where the domain should resolve.

HTTPS is provided by the hosting platform through an SSL/TLS certificate.

For my future FlyRank domain, the expected flow is:

```text
mussarat.flyrank.ai
        ↓
DNS resolves domain
        ↓
Vercel receives request
        ↓
Vercel provides HTTPS/TLS
        ↓
Secure website connection
```

Once the custom domain is correctly configured and the SSL certificate is issued, the website should be accessible securely over:

```text
https://mussarat.flyrank.ai
```

The browser's padlock indicates that the HTTPS connection has been established successfully.

---

# 10. My Current Deployment Architecture

My current website uses a separated frontend and backend architecture.

```text
                    User
                     │
                     ▼
              Vercel Frontend
                 Next.js
                     │
                     │ API Requests
                     ▼
             Hugging Face Backend
                  FastAPI
                     │
                     ▼
              AI / RAG Services
                     │
                     ▼
             Supabase Vector DB
```

The frontend is deployed on Vercel and the backend/AI service is deployed on Hugging Face.

The future FlyRank domain will point to the **frontend hosted on Vercel**.

The backend does not need to become the target of the personal website domain because it is an API service consumed by the frontend.

---

# 11. Future FlyRank Domain Checklist

When the FlyRank subdomain is provisioned, I will use the following process:

### Step 1

Receive the assigned FlyRank subdomain.

Example:

```text
mussarat.flyrank.ai
```

### Step 2

Open my Vercel project.

### Step 3

Add the FlyRank domain under the project's domain settings.

### Step 4

Configure the DNS record required by Vercel/FlyRank.

For a CNAME-based setup, the record will conceptually contain:

```text
Type: CNAME
Name: [provided hostname]
Target: [provided Vercel hostname]
```

I will use the exact target supplied by the hosting/DNS configuration rather than manually guessing it.

### Step 5

Wait for DNS changes to propagate.

### Step 6

Verify that the domain resolves to the portfolio.

### Step 7

Verify HTTPS and the browser padlock.

### Step 8

Test the website in a private/incognito browser window.

### Step 9

Confirm that the frontend still communicates correctly with the Hugging Face backend.

---

# 12. Troubleshooting Checklist

If the domain does not work immediately, I would check:

* Is the DNS record correctly entered?
* Is the CNAME target correct?
* Is the domain added to the Vercel project?
* Are there conflicting DNS records?
* Has DNS propagation completed?
* Has the SSL certificate been issued?
* Does the domain work from another network or private browser window?
* Is the backend API still reachable from the deployed frontend?

The first step is to verify the DNS configuration before changing application code.

---

# 13. Key Concepts I Understand

Through this setup, I understand the difference between:

**Domain**

The human-readable address users enter.

```text
mussarat.flyrank.ai
```

**DNS**

The system responsible for resolving domain names to their configured destinations.

**Nameserver**

The server/service that provides authoritative DNS information for a domain.

**DNS Record**

A specific DNS instruction such as a CNAME.

**CNAME**

A DNS record that aliases one hostname to another hostname.

**Hosting**

The infrastructure where the actual website application runs.

In my case:

```text
Vercel → Frontend
Hugging Face → Backend
```

**HTTPS**

The encrypted protocol used to securely communicate between the browser and website.

---

# 14. Final Summary

My current portfolio is already deployed and publicly accessible through Vercel.

The future FlyRank subdomain will be connected through DNS rather than requiring the website to be rebuilt or migrated.

The complete flow is:

```text
User
  ↓
mussarat.flyrank.ai
  ↓
DNS Resolver
  ↓
Authoritative Nameserver
  ↓
CNAME / DNS Record
  ↓
Vercel
  ↓
Next.js Portfolio
  ↓
Hugging Face Backend
  ↓
AI / RAG Services
```

The important principle is that **DNS provides the path to the hosted application, while Vercel continues to host the frontend application itself**.

When the FlyRank subdomain is provisioned, I will add the custom domain to Vercel, configure the required DNS record, wait for propagation, verify HTTPS, and test the complete production website.

---

## Current Website

**Frontend:** Vercel
**Backend:** Hugging Face
**Frontend URL:** `https://mussarat-web-dev.vercel.app/`

**Future domain:** `mussarat_shamsher.flyrank.ai` *(example; actual subdomain will be provided by FlyRank)*

**Current status:** Website is publicly live over HTTPS.
**Future status:** FlyRank custom subdomain will be configured after capstone approval.
