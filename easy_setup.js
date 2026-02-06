const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn, execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env');
const exampleEnvPath = path.join(__dirname, '.env.example');

// Colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const reset = '\x1b[0m';

console.log(`${cyan}=== MiroFish Easy Setup ===${reset}\n`);

async function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnv() {
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    console.log(`${yellow}Found existing .env file.${reset}`);
    envContent = fs.readFileSync(envPath, 'utf8');
  } else if (fs.existsSync(exampleEnvPath)) {
    console.log(`${yellow}Creating .env from .env.example...${reset}`);
    envContent = fs.readFileSync(exampleEnvPath, 'utf8');
  } else {
    console.log(`${yellow}No .env.example found, creating fresh .env...${reset}`);
  }

  // Parse existing env
  const envConfig = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      envConfig[match[1].trim()] = match[2].trim();
    }
  });

  // Check and prompt for LLM_API_KEY
  if (!envConfig['LLM_API_KEY'] || envConfig['LLM_API_KEY'].includes('your_api_key')) {
    const key = await askQuestion(`${green}Enter your LLM_API_KEY (OpenAI/Qwen): ${reset}`);
    if (key.trim()) envConfig['LLM_API_KEY'] = key.trim();
  }

  // Check and prompt for ZEP_API_KEY
  if (!envConfig['ZEP_API_KEY'] || envConfig['ZEP_API_KEY'].includes('your_zep_api_key')) {
    const key = await askQuestion(`${green}Enter your ZEP_API_KEY: ${reset}`);
    if (key.trim()) envConfig['ZEP_API_KEY'] = key.trim();
  }
  
  // Reconstruct .env content
  let newEnvContent = '';
  // Preserve comments from example if possible, but for now just write keys
  // Better: read example again and replace values
  if (fs.existsSync(exampleEnvPath)) {
    let exampleContent = fs.readFileSync(exampleEnvPath, 'utf8');
    for (const [key, val] of Object.entries(envConfig)) {
       // specific replacement to avoid replacing substring matches in comments
       const regex = new RegExp(`^${key}=.*$`, 'm');
       if (regex.test(exampleContent)) {
         exampleContent = exampleContent.replace(regex, `${key}=${val}`);
       } else {
         exampleContent += `\n${key}=${val}`;
       }
    }
    newEnvContent = exampleContent;
  } else {
    for (const [key, val] of Object.entries(envConfig)) {
      newEnvContent += `${key}=${val}\n`;
    }
  }

  fs.writeFileSync(envPath, newEnvContent);
  console.log(`${green}✔ .env configuration updated.${reset}\n`);
}

async function runCommand(command, args, cwd) {
  console.log(`${cyan}> ${command} ${args.join(' ')}${reset}`);
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { stdio: 'inherit', shell: true, cwd });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
  });
}

async function main() {
  try {
    await setupEnv();

    console.log(`${cyan}Installing dependencies...${reset}`);
    
    // Root install
    console.log(`${yellow}Installing root dependencies (bun)...${reset}`);
    await runCommand('bun', ['install'], __dirname);

    // Frontend install
    console.log(`${yellow}Installing frontend dependencies (bun)...${reset}`);
    await runCommand('bun', ['install'], path.join(__dirname, 'frontend'));

    // Backend setup
    console.log(`${yellow}Setting up backend (using uv)...${reset}`);
    
    // Create .python-version if not exists
    const pyVersionPath = path.join(__dirname, 'backend', '.python-version');
    if (!fs.existsSync(pyVersionPath)) {
        console.log(`${yellow}Creating backend/.python-version (3.12)...${reset}`);
        fs.writeFileSync(pyVersionPath, '3.12');
    }

    try {
        await runCommand('uv', ['sync'], path.join(__dirname, 'backend'));
    } catch (e) {
        console.log(`${yellow}uv sync failed. Trying to install python 3.12 first...${reset}`);
        await runCommand('uv', ['python', 'install', '3.12'], path.join(__dirname, 'backend'));
        await runCommand('uv', ['sync'], path.join(__dirname, 'backend'));
    }

    console.log(`${green}\n✨ Setup complete! ✨${reset}`);
    console.log(`Run the app with: ${cyan}bun run dev${reset}`);

  } catch (error) {
    console.error(`${reset}\n❌ Error: ${error.message}`);
  } finally {
    rl.close();
  }
}

main();
