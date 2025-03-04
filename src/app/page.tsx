"use client";

import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";

const idiomas = [
  { codigo: "pt", nome: "Português (Brasil)" },
  { codigo: "pt-pt", nome: "Português (Portugal)" },
  { codigo: "en", nome: "Inglês" },
  { codigo: "es", nome: "Espanhol" },
  { codigo: "fr", nome: "Francês" },
  { codigo: "it", nome: "Italiano" },
  { codigo: "de", nome: "Alemão" },
  { codigo: "hu", nome: "Húngaro" },
  { codigo: "ja", nome: "Japonês" },
  { codigo: "zh", nome: "Chinês" },
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [srcLang, setSrcLang] = useState("pt");
  const [tgtLang, setTgtLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [stars, setStars] = useState<Star[]>([]);

  type Star = {
    id: number;
    size: number;
    top: number;
    left: number;
    opacity: number;
    duration: number;
    rotate: number;
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "text/plain": [".txt"] },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Selecione um arquivo!");
      return;
    }
  
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
  
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const response = await axios.post(
        `https://liaai.onrender.com/traduzir-arquivo/?src_lang=${srcLang}&tgt_lang=${tgtLang}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob', 
          withCredentials: true, 
        }
      );
      
      if (response && response.data instanceof Blob) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `traduzido_${file.name}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
  
        setSuccessMessage("Tradução concluída com sucesso!");
      } else {
        throw new Error("Formato de resposta inválido.");
      }
    } catch (error) {
      console.error("Erro ao traduzir:", error);
      setErrorMessage("Erro ao traduzir arquivo.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const generatedStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.8 + 0.2,
      duration: Math.random() * 5 + 3,
      rotate: Math.random() * 360,
    }));

    setStars(generatedStars);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white relative overflow-hidden">
      <div className="z-10 bg-black bg-opacity-50 p-8 rounded-xl shadow-2xl space-y-6 w-full max-w-2xl backdrop-blur-lg">
        <h1 className="text-5xl font-bold text-center text-gray-100 tracking-wide" style={{ fontFamily: 'var(--font-dancing-script)' }}>
          Lia.AI
        </h1>
        <div className="flex space-x-4">
          <div className="w-full">
            <label className="text-lg font-semibold text-gray-200 tracking-wide">
              Origem
            </label>
            <Select onValueChange={setSrcLang} defaultValue="pt">
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Idioma de Origem" />
              </SelectTrigger>
              <SelectContent>
                {idiomas.map((lang) => (
                  <SelectItem key={lang.codigo} value={lang.codigo}>
                    {lang.nome}
                  </SelectItem>
                )).filter((lang) => lang.key === "pt")}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full">
          <label className="text-lg font-semibold text-gray-200 tracking-wide">
              Destino
            </label>
            <Select onValueChange={setTgtLang} defaultValue="en">
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Idioma de Destino" />
              </SelectTrigger>
              <SelectContent>
                {idiomas.map((lang) => (
                  <SelectItem key={lang.codigo} value={lang.codigo}>
                    {lang.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer bg-transparent hover:bg-gray-500 transition duration-300 relative"
        >
          <input {...getInputProps()} />
          {file ? (
            <p className="text-green-400">{file.name}</p>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <UploadCloud className="w-12 h-12 text-gray-300" />
              <p className="text-gray-300">Arraste seu arquivo .txt aqui ou clique para selecionar</p>
            </div>
          )}
        </div>

        <Button
          className="w-full mt-2 h-[6vh] py-3 text-xl font-semibold bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500 hover:from-gray-200 hover:via-gray-400 hover:to-gray-600 text-gray-900 rounded-lg transition duration-300"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Traduzindo..." : "Traduzir Arquivo"}
        </Button>

        {errorMessage && (
          <div className="mt-4 p-4 bg-red-600 text-white rounded-lg text-center">
            <p>{errorMessage}</p>
          </div>
        )}
        {successMessage && (
          <div className="mt-4 p-4 bg-green-600 text-white rounded-lg text-center">
            <p>{successMessage}</p>
          </div>
        )}
      </div>

      <div className="absolute inset-0 z-0 bg-[url('https://www.w3schools.com/w3images/stars.jpg')] bg-cover bg-fixed"></div>

      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20">
          <div className="flex items-center space-x-2 text-white">
            <div className="w-8 h-8 border-4 border-t-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg">Carregando...</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.top}vh`,
              left: `${star.left}vw`,
              opacity: star.opacity,
              transform: `rotate(${star.rotate}deg)`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              scale: [1, 1.2, 1],
              opacity: [star.opacity, star.opacity * 1.2, star.opacity],
            }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </main>
  );
}
