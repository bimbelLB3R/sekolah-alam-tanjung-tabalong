
// import { Card, CardContent } from '@/components/ui/card';
// import Link from 'next/link';
// import { motion } from "framer-motion";


// export default function DashboardCard({ title, value, href, bgColor,index,icon:Icon }) {
//   // console.log(index)
//   return (
//     <div key={index}>
//     <motion.div
              
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//             >
//     <Link href={href}>
//       <Card className="cursor-pointer hover:shadow-lg transition rounded-2xl">
//           <CardContent className="flex flex-col items-center justify-center p-8">
//             {Icon && <Icon className="w-10 h-10 text-orange-500 mb-3" />}
//             <span className="text-lg font-medium text-center">{title}</span>
//           </CardContent>
//       </Card>
//     </Link>
//     </motion.div>
//     </div>
//   );
// }


import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from "framer-motion";

export default function DashboardCard({ 
  title, 
  value, 
  href, 
  bgColor, 
  index = 0, 
  icon: Icon,
  disabled = false 
}) {
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: index * 0.05, // Stagger animation
        duration: 0.3
      }
    }
  };

  const CardWrapper = disabled ? 'div' : Link;
  const wrapperProps = disabled ? {} : { href };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
    >
      <CardWrapper {...wrapperProps}>
        <Card 
          className={`
            rounded-2xl transition-all duration-300
            ${disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'cursor-pointer hover:shadow-lg hover:border-orange-200'
            }
            ${bgColor || ''}
          `}
        >
          <CardContent className="flex flex-col items-center justify-center p-8">
            {Icon && (
              <Icon className="w-10 h-10 text-orange-500 mb-3" />
            )}
            <span className="text-lg font-medium text-center">
              {title}
            </span>
            {value !== undefined && (
              <span className="text-2xl font-bold text-orange-600 mt-2">
                {value}
              </span>
            )}
          </CardContent>
        </Card>
      </CardWrapper>
    </motion.div>
  );
}