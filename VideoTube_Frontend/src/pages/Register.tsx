import {motion } from 'framer-motion'

interface formData{
  fullName: string
  username: string
  email: string
  password: string
  confirmPassword: string

}

const Register = () => {
  return (
    <div className="relative min-h-screen w-full flex overflow-hidden">
      {/* bg-glows */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-accent opacity-10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-accent opacity-10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-primary" />

      {/* Left Div */}
      <motion.div
      initial = ""
      animate = ""
      transition=""
      className=''
      >
        <div className=""></div>
      </motion.div>
    </div>
  );
}

export default Register