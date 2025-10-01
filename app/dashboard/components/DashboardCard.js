
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { motion } from "framer-motion";


export default function DashboardCard({ title, value, href, bgColor,index,icon:Icon }) {
  // console.log(index)
  return (
    <div key={index}>
    <motion.div
              
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
    <Link href={href}>
      <Card className="cursor-pointer hover:shadow-lg transition rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center p-8">
            {Icon && <Icon className="w-10 h-10 text-orange-500 mb-3" />}
            <span className="text-lg font-medium text-center">{title}</span>
          </CardContent>
      </Card>
    </Link>
    </motion.div>
    </div>
  );
}
