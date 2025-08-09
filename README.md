# Lovable P1 Mini

### Prerequisites
- Node 18+ and npm
- Python 3.10+

### Install and run the frontend
```bash
cd frontend
npm install
npm run dev
```

### Install Python deps
```bash
# Option A: Via virtual environment + setup.py (recommended)
cd backend
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

# Option B: Directly from requirements.txt
python3 -m pip install -r requirements.txt
```

### Configure Backend
```bash
cd backend
cp .env.example .env  # optional
export GOOGLE_API_KEY=YOUR_KEY
```

### Directly Generate app code 
```bash
cd backend && python3 src/generate_app.py --prompt "Create a task management app with dark mode and calendar integration"
```

## About
### **Your Next-Gen App Builder: Features & Capabilities**

This platform is meticulously designed to simplify app creation, offering a powerful and intuitive experience for generating custom applications from simple text prompts.

#### **Effortless App Generation, Powered by AI**

Our intuitive platform empowers anyone to **create custom applications simply using text prompts**. Forget complex coding – just tell us what you envision, and watch it come to life. We offer two dynamic modes to suit your needs:

* **Mock Mode**: Instantly visualize your app's features with **mock code and designs**. This is perfect for rapid prototyping, iterating on ideas, and exploring functionalities without consuming any backend resources. Get immediate feedback on your concept!

* **AI Mode**: Step into the future of development. This mode leverages the power of the **cutting-edge Gemini model** to generate actual, functional code for your desired application. It's where your ideas transform into deployable software.

#### **Designed for Efficiency and User Control**

We've packed in features that prioritize your time, resources, and creative freedom:

* **Smart Preview & Resource Optimization**: Why build the whole house to see if you like the blueprint? Our unique **"preview/quick view"** feature allows you to see a glimpse of your app's design and structure *before* full generation. This not only **saves valuable user time** but also **significantly reduces computational resource consumption**, preventing unnecessary full builds.

* **Minimal AI Token Usage**: We believe in smart technology. By utilizing a **template-based architecture**, our app intelligently fetches only the *essential, dynamic content* from Gemini. This innovative design ensures **minimal token usage**, making the generation process highly efficient and cost-effective for both you and us.

* **Persistent Projects with Local Storage**: Never lose your progress. All your previously created applications are automatically stored securely in **local storage**, ensuring you can easily pick up where you left off and revisit your projects anytime, anywhere.

* **Integrated Code Editor**: Dive deeper into your creations with our built-in **code editor**. View and even fine-tune the generated files directly within the application, offering a seamless and truly integrated development experience.

* **Seamless Pre-Build Theming**: Say goodbye to post-build styling headaches! Our platform provides **pre-build theme specification options**, allowing you to define your app's aesthetic preferences *before* generation. This drastically **reduces errors** and eliminates the tedious process of adjusting themes after your app is built.

#### **Seamless Integrations for Automation**

Recognizing that automation is the bedrock of modern workflows, our app provides robust integration capabilities:

* **Confluence Integration** (Coming Soon): **Import ideas from Confluence effortlessly and effortlessly publish generated app documentation**, project plans, or updates directly to your Confluence spaces. This streamlines knowledge sharing and ensures your team is always in sync with the latest application developments.

* **Slack Integration** (Coming Soon): **Import ideas from Slack effortlessly** and stay updated in real-time. Our app can **send automated notifications** to your Slack channels about app generation progress, completion, or any potential issues. Foster collaboration and keep your team informed without leaving their favorite communication hub.

### **Your Expert Co-Pilot**

Building an app should be empowering, not frustrating:

* **"Expert Help" Option**: Should you ever find yourself at a crossroads or need, pay some premium and get expert help