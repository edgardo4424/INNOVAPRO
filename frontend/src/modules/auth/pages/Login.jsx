import { APP_VERSION } from "@/config";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha"; // Importamos reCAPTCHA
import styles from "./Login.module.css";
import "@/styles/global.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Building2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
   const [showPassword, setShowPassword] = useState(false);
   const [rememberMe, setRememberMe] = useState(false);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const recaptchaRef = useRef(null);
   const [recaptchaToken, setRecaptchaToken] = useState(null); // Guardamos el token del reCAPTCHA
   const { login } = useAuth();
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false); // ⏳ Estado de carga

   useEffect(() => {
      if (recaptchaRef.current) {
         recaptchaRef.current.reset(); // 🔹 Reinicia el reCAPTCHA al cargar la página
      }
   }, []);

   function handleRecaptcha(value) {
      setRecaptchaToken(value);
   }

   async function handleSubmit(e) {
      e.preventDefault();

      if (loading) return; // ⛔ Evitar múltiples clics

      if (!recaptchaToken) {
         alert("❌ Debes completar el reCAPTCHA.");
         return;
      }

      setLoading(true); // 🔥 Desactiva el botón

      const success = await login(email, password, recaptchaToken, navigate);
      if (success) {
         console.log("✅ Login exitoso. Redirigiendo al dashboard...");
         navigate("/");
      } else {
         alert("❌ Credenciales incorrectas o fallo en reCAPTCHA.");
         setLoading(false); // 🔥 Reactiva el botón
      }
   }

   return (
      <article className="h-screen flex flex-col md:flex-row overflow-hidden">
         <section className="w-full lg:w-3/5 h-auto hidden md:flex">
            <img
               src="/images/fondo_mesa.webp"
               alt="Imagen de login"
               className="w-full h-full object-cover"
            />
         </section>
         <section className="w-full lg:w-2/5 flex items-center justify-center p-6 lg:p-12 bg-white h-screen">
            <Card className="w-full max-w-md relative z-10  backdrop-blur-sm border-0  shadow-none">
               <CardHeader className=" text-center">
                  <div className="flex items-center justify-center space-x-2">
                     <img
                        src="/images/logo_azul.png"
                        alt="Logo Innova"
                        className=" w-[60%]"
                     />
                  </div>

                  <div className="space-y-1 ">
                     <CardDescription className="text-gray-600">
                        Ingresa tus credenciales para acceder al sistema
                     </CardDescription>
                  </div>
               </CardHeader>

               <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-2 ">
                     {/* Email Field */}
                     <div className="space-y-2 ">
                        <Label
                           htmlFor="email"
                           className="text-sm font-medium text-gray-700"
                        >
                           Correo Electrónico
                        </Label>
                        <div className="relative">
                           <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                           <Input
                              id="email"
                              type="email"
                              placeholder="example@grupoinnova.pe"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                              required
                           />
                        </div>
                     </div>

                     {/* Password Field */}
                     <div className="space-y-2 ">
                        <Label
                           htmlFor="password"
                           className="text-sm font-medium text-gray-700"
                        >
                           Contraseña
                        </Label>
                        <div className="relative">
                           <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                           <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="pl-10 pr-10 h-12 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                              required
                           />
                           <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                           >
                              {showPassword ? (
                                 <EyeOff className="h-4 w-4" />
                              ) : (
                                 <Eye className="h-4 w-4" />
                              )}
                           </button>
                        </div>
                     </div>

                     {/* Remember Me & Forgot Password */}
                     {/* <div className="flex items-center justify-between ">
                     <div className="flex items-center space-x-2">
                        <Checkbox
                           id="remember"
                           checked={rememberMe}
                           onCheckedChange={(checked) =>
                              setRememberMe(checked === true)
                           }
                           className="border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <Label
                           htmlFor="remember"
                           className="text-sm text-gray-600 cursor-pointer"
                        >
                           Recordarme
                        </Label>
                     </div>
                     <button
                        type="button"
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                     >
                        ¿Olvidaste tu contraseña?
                     </button>
                  </div> */}

                     {/* reCAPTCHA Placeholder */}

                     <div className="w-[290x] h-[76px] mx-auto flex justify-center">
                       
                        <ReCAPTCHA
                           ref={recaptchaRef}
                           sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                           onChange={handleRecaptcha}
                           size="normal"
                        />
                     </div>

                     {/* Login Button */}
                     <Button
                        type="submit"
                        className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium text-base transition-all duration-200 shadow-lg hover:shadow-xl"
                        disabled={loading}
                     >
                        {loading ? (
                           <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Ingresando...</span>
                           </div>
                        ) : (
                           "Ingresar"
                        )}
                     </Button>
                  </form>

                  {/* Additional Links */}
                  <div className="mt-6 text-center space-y-2">
                     <p className="text-xs text-gray-500">
                        ¿Necesitas ayuda?{" "}
                        <button className="text-orange-600 hover:text-orange-700 transition-colors">
                           Contactar soporte
                        </button>
                     </p>
                  </div>
               </CardContent>
            </Card>
         </section>
      </article>
   );
}
