import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  staggerDelay?: number;
}

const StaggerChildren = ({ children, className, itemClassName, staggerDelay = 0.1 }: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <motion.div key={index} variants={item} className={itemClassName}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={item} className={itemClassName}>{children}</motion.div>
      }
    </motion.div>
  );
};

export default StaggerChildren;