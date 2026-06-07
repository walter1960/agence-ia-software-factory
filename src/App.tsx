import React, { useState } from 'react';
import { 
  Terminal, Play, Check, Server, RefreshCw, Cpu, Layers, Code, 
  Folder, FolderOpen, FileText, CheckCircle, PlayCircle, Shield, Bug
} from 'lucide-react';

interface FileItem {
  name: string;
  content: string;
}

export default function App() {
  const [projectName, setProjectName] = useState('URL Shortener API');
  const [projectDesc, setProjectDesc] = useState('Une API REST Express pour raccourcir des URLs avec persistance memoire Redis.');
  const [stack, setStack] = useState<'express' | 'fastapi' | 'go'>('express');
  
  // Build workflow steps
  const [buildStep, setBuildStep] = useState<'idle' | 'supervisor' | 'architect' | 'developer' | 'qa' | 'completed'>('idle');
  const [logStream, setLogStream] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string>('package.json');
  const [testReport, setTestReport] = useState<string[]>([]);

  // Generated project files database
  const generatedFiles: Record<string, FileItem[]> = {
    express: [
      {
        name: "package.json",
        content: `{
  "name": "url-shortener-api",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "express": "^4.19.2",
    "redis": "^4.6.15",
    "nanoid": "^3.3.7"
  },
  "scripts": {
    "start": "node index.js",
    "test": "node test.js"
  }
}`
      },
      {
        name: "index.js",
        content: `const express = require('express');
const redis = require('redis');
const { nanoid } = require('nanoid');

const app = express();
app.use(express.json());

const client = redis.createClient({ url: process.env.REDIS_URL });
client.on('error', err => console.log('Redis Error', err));

app.post('/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  
  const id = nanoid(6);
  await client.set(id, url);
  res.json({ shortUrl: \`http://localhost:3000/\${id}\` });
});

app.get('/:id', async (req, res) => {
  const url = await client.get(req.params.id);
  if (!url) return res.status(404).send('URL not found');
  res.redirect(url);
});

app.listen(3000, async () => {
  await client.connect();
  console.log('Server running on port 3000');
});`
      },
      {
        name: "test.js",
        content: `const assert = require('assert');
console.log('[QA] Running integration tests inside Docker Sandbox...');

// Simulate test scenarios
setTimeout(() => {
  console.log('✔ Test Case 1: POST /shorten - Returns shortened URL ID (PASSED)');
  console.log('✔ Test Case 2: GET /:id - Redirects successfully to target URL (PASSED)');
  console.log('[QA] All 2 tests successfully passed.');
}, 500);`
      }
    ],
    fastapi: [
      {
        name: "requirements.txt",
        content: `fastapi==0.111.0
uvicorn==0.30.1
redis==5.0.4
pydantic==2.7.2`
      },
      {
        name: "main.py",
        content: `import os
import redis
from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, HttpUrl
import uuid

app = FastAPI(title="URL Shortener API")
r = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379/0"), decode_responses=True)

class ShortenRequest(BaseModel):
    url: HttpUrl

@app.post("/shorten")
def shorten_url(req: ShortenRequest):
    short_id = str(uuid.uuid4())[:6]
    r.set(short_id, str(req.url))
    return {"shortUrl": f"http://localhost:8000/{short_id}"}

@app.get("/{short_id}")
def redirect_to_url(short_id: str):
    url = r.get(short_id)
    if not url:
        raise HTTPException(status_code=404, detail="URL not found")
    return RedirectResponse(url=url)`
      }
    ],
    go: [
      {
        name: "go.mod",
        content: `module url-shortener

go 1.21

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/redis/go-redis/v9 v9.5.1
)`
      },
      {
        name: "main.go",
        content: `package main

import (
    "context"
    "net/http"
    "github.com/gin-gonic/gin"
    "github.com/redis/go-redis/v9"
)

var ctx = context.Background()

func main() {
    rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
    r := gin.Default()

    r.POST("/shorten", func(c *gin.Context) {
        var req struct{ URL string \`json:"url"\` }
        c.BindJSON(&req)
        
        id := "goShort" // Simpified generator
        rdb.Set(ctx, id, req.URL, 0)
        c.JSON(200, gin.H{"shortUrl": "http://localhost:8080/" + id})
    })

    r.Run(":8080")
}`
      }
    ]
  };

  const handleStartBuild = () => {
    setBuildStep('supervisor');
    setLogStream(["[Supervisor] Analyse des spécifications textuelles...", "[Supervisor] Définition des dépendances (Express, Redis, nanoid)..."]);
    setTestReport([]);

    // 1. Supervisor
    setTimeout(() => {
      setBuildStep('architect');
      setLogStream(prev => [
        "[Architect] Conception de l'API REST...",
        "[Architect] Definition des endpoints : POST /shorten, GET /:id",
        ...prev
      ]);

      // 2. Developer
      setTimeout(() => {
        setBuildStep('developer');
        setLogStream(prev => [
          "[Developer] Claw Code initialisé pour l'écriture des fichiers...",
          "[Developer] Génération de package.json...",
          "[Developer] Génération de index.js (Intégration d'Express et du client Redis)...",
          "[Developer] Fichiers sources écrits avec succès.",
          ...prev
        ]);
        setActiveFile(stack === 'express' ? 'index.js' : stack === 'fastapi' ? 'main.py' : 'main.go');

        // 3. QA
        setTimeout(() => {
          setBuildStep('qa');
          setLogStream(prev => [
            "[QA] Initialisation de la sandbox Docker sécurisée...",
            "[QA] Installation des dependances via npm install...",
            "[QA] Lancement des tests d'integration...",
            ...prev
          ]);
          setTestReport([
            "✔ Test Case 1: POST /shorten - Raccourcissement de URL - PASSED",
            "✔ Test Case 2: GET /:id - Redirection vers URL cible - PASSED"
          ]);

          // 4. Completed
          setTimeout(() => {
            setBuildStep('completed');
            setLogStream(prev => [
              "[Supervisor] Tous les tests ont passé (100% de reussite).",
              "[Supervisor] Déploiement automatique vers Vercel declenche.",
              "[System] Build termine avec succes !",
              ...prev
            ]);
          }, 1500);
        }, 1500);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col p-4 md:p-8 space-y-6">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-violet-500/20 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20 text-violet-400">
            <Layers className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent uppercase font-mono">
              Software Engineering Factory
            </h1>
            <p className="text-slate-400 text-sm mt-0.5 font-mono">
              Usine de production logicielle autonome (Multi-Agents)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400">Statut de l'usine :</span>
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border flex items-center gap-1.5 ${
            buildStep === 'idle' ? 'bg-slate-800 text-slate-400 border-slate-700' :
            buildStep === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
            'bg-violet-500/10 text-violet-400 border-violet-500/20'
          }`}>
            {buildStep === 'idle' ? 'Inactif' : buildStep === 'completed' ? 'Pret / Déployé' : 'En production'}
          </span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Specification Form */}
        <section className="lg:col-span-4 flex flex-col space-y-6">
          
          <div className="factory-card p-6 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold flex items-center gap-2 font-mono uppercase tracking-widest text-violet-400">
              <Server className="h-4.5 w-4.5" /> Specs du Projet
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-mono">Nom du Projet</label>
                <input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-sm text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-mono">Cahier des charges textuel</label>
                <textarea
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  rows={4}
                  className="w-full text-xs bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5 font-mono">Stack Technologique</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => { setStack('express'); setBuildStep('idle'); }}
                    className={`py-2 text-xs font-semibold rounded-lg border font-mono ${
                      stack === 'express' ? 'bg-violet-950/20 border-violet-500 text-violet-400' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    Express
                  </button>
                  <button
                    onClick={() => { setStack('fastapi'); setBuildStep('idle'); }}
                    className={`py-2 text-xs font-semibold rounded-lg border font-mono ${
                      stack === 'fastapi' ? 'bg-violet-950/20 border-violet-500 text-violet-400' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    FastAPI
                  </button>
                  <button
                    onClick={() => { setStack('go'); setBuildStep('idle'); }}
                    className={`py-2 text-xs font-semibold rounded-lg border font-mono ${
                      stack === 'go' ? 'bg-violet-950/20 border-violet-500 text-violet-400' : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    Go Gin
                  </button>
                </div>
              </div>

              <button
                onClick={handleStartBuild}
                disabled={buildStep !== 'idle' && buildStep !== 'completed'}
                className="w-full py-2.5 rounded-lg btn-factory font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <PlayCircle className="h-4 w-4" /> Lancer la production
              </button>
            </div>
          </div>

          {/* Real-time event log */}
          <div className="factory-card p-6 rounded-2xl flex flex-col space-y-3">
            <h3 className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">Logs de Construction</h3>
            <div className="bg-slate-950 p-4 rounded-lg font-mono text-[10px] text-slate-300 h-40 overflow-y-auto space-y-1.5 border border-slate-900">
              {logStream.length > 0 ? (
                logStream.map((log, i) => (
                  <p key={i} className={
                    log.includes('[Supervisor]') ? 'text-violet-400' :
                    log.includes('[Architect]') ? 'text-cyan-400' :
                    log.includes('[Developer]') ? 'text-cyan-300' :
                    log.includes('[QA]') ? 'text-amber-400' : 'text-slate-400'
                  }>
                    {log}
                  </p>
                ))
              ) : (
                <p className="text-slate-600 italic">En attente de lancement...</p>
              )}
            </div>
          </div>
        </section>

        {/* Middle Column: Agent Pipeline Flow */}
        <section className="lg:col-span-3 factory-card p-6 rounded-2xl flex flex-col space-y-6">
          <h2 className="text-sm font-bold font-mono uppercase tracking-widest text-violet-400">Orchestration Swarm</h2>

          <div className="space-y-4">
            
            {/* Step 1: Supervisor */}
            <div className={`p-4 rounded-xl border transition ${
              buildStep === 'supervisor' ? 'border-violet-500 bg-violet-950/10' : 'border-slate-850 bg-slate-900/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-400">01. SUPERVISOR</span>
                {buildStep !== 'idle' && buildStep !== 'supervisor' && <Check className="h-4 w-4 text-emerald-400" />}
                {buildStep === 'supervisor' && <Loader2 className="h-4 w-4 animate-spin text-violet-500" />}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-4">Planification des milestones, structure globale du projet.</p>
            </div>

            {/* Step 2: Architect */}
            <div className={`p-4 rounded-xl border transition ${
              buildStep === 'architect' ? 'border-violet-500 bg-violet-950/10' : 'border-slate-850 bg-slate-900/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-400">02. ARCHITECT</span>
                {['developer', 'qa', 'completed'].includes(buildStep) && <Check className="h-4 w-4 text-emerald-400" />}
                {buildStep === 'architect' && <Loader2 className="h-4 w-4 animate-spin text-violet-500" />}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-4">Design des routes APIs, data models, routes et middleware.</p>
            </div>

            {/* Step 3: Developer */}
            <div className={`p-4 rounded-xl border transition ${
              buildStep === 'developer' ? 'border-violet-500 bg-violet-950/10' : 'border-slate-850 bg-slate-900/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-400">03. DEVELOPER</span>
                {['qa', 'completed'].includes(buildStep) && <Check className="h-4 w-4 text-emerald-400" />}
                {buildStep === 'developer' && <Loader2 className="h-4 w-4 animate-spin text-violet-500" />}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-4">Ecriture du code source clean, generation du boilerplate.</p>
            </div>

            {/* Step 4: QA Tester */}
            <div className={`p-4 rounded-xl border transition ${
              buildStep === 'qa' ? 'border-violet-500 bg-violet-950/10' : 'border-slate-850 bg-slate-900/20'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-400">04. QA TESTER</span>
                {buildStep === 'completed' && <Check className="h-4 w-4 text-emerald-400" />}
                {buildStep === 'qa' && <Loader2 className="h-4 w-4 animate-spin text-violet-500" />}
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-4">Execution des tests d'integration unitaires en sandbox Docker.</p>
            </div>

          </div>
        </section>

        {/* Right Column: Code & Sandbox File Explorer */}
        <section className="lg:col-span-5 flex flex-col space-y-6">
          
          <div className="factory-card p-6 rounded-2xl flex-1 flex flex-col space-y-4">
            <h2 className="text-sm font-bold flex items-center gap-2 font-mono uppercase tracking-widest text-violet-400">
              <Code className="h-4.5 w-4.5" /> Workspace & Explorateur de Fichiers
            </h2>

            {/* File navigator tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
              {generatedFiles[stack].map((file, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFile(file.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono rounded-lg border transition ${
                    activeFile === file.name ? 'bg-violet-950/20 border-violet-500 text-violet-400' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" /> {file.name}
                </button>
              ))}
            </div>

            {/* Code editor viewer */}
            <div className="flex-1 min-h-[200px] relative">
              <pre className="absolute inset-0 p-4 bg-slate-950 border border-slate-850 font-mono text-[10px] text-cyan-300 leading-5 rounded-lg overflow-y-auto">
                {buildStep !== 'idle' && buildStep !== 'supervisor' && buildStep !== 'architect' ? (
                  generatedFiles[stack].find(f => f.name === activeFile)?.content
                ) : (
                  <span className="text-slate-600 italic">Les fichiers du projet seront affiches ici pendant le developpement...</span>
                )}
              </pre>
            </div>
          </div>

          {/* Docker Sandbox Test cases */}
          {testReport.length > 0 && (
            <div className="factory-card p-6 rounded-2xl space-y-3 fade-in border-l-4 border-emerald-500">
              <h3 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-widest flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-emerald-400" /> Docker Sandbox : Rapport de Test
              </h3>
              <div className="space-y-2 font-mono text-[10px] text-slate-300">
                {testReport.map((rep, idx) => (
                  <p key={idx} className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> {rep}
                  </p>
                ))}
              </div>
            </div>
          )}

        </section>

      </div>
    </div>
  );
}

// Simple Helper Component
function Loader2({ className }: { className?: string }) {
  return <RefreshCw className={`animate-spin ${className}`} />;
}
