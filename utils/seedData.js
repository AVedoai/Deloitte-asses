/**
 * Seed Data Utility
 * Populates database with sample data for development and testing
 */

const userModel = require('../models/userModel');
const courseModel = require('../models/courseModel');
const lessonModel = require('../models/lessonModel');
const enrollmentModel = require('../models/enrollmentModel');
const progressModel = require('../models/progressModel');

/**
 * Seed all data
 */
const seedAllData = async () => {
  try {
    console.log('🌱 Seeding database with sample data...');

    // Clear existing data
    userModel.clearAllUsers();
    courseModel.clearAllCourses();
    lessonModel.clearAllLessons();
    enrollmentModel.clearAllEnrollments();
    progressModel.clearAllProgress();

    // Seed users (with pre-hashed passwords for speed)
    const users = await seedUsers();
    console.log(`✅ Created ${users.length} users`);

    // Seed courses
    const courses = seedCourses(users);
    console.log(`✅ Created ${courses.length} courses`);

    // Seed lessons
    const lessons = seedLessons(courses);
    console.log(`✅ Created ${lessons.length} lessons`);

    // Seed enrollments
    const enrollments = seedEnrollments(users, courses);
    console.log(`✅ Created ${enrollments.length} enrollments`);

    // Seed progress
    const progress = seedProgress(enrollments, lessons);
    console.log(`✅ Created ${progress.length} progress records`);

    console.log('🎉 Database seeded successfully!\n');
    console.log('📋 Test Credentials:');
    console.log('   Admin: admin@lms.com / admin123');
    console.log('   Instructor: instructor1@lms.com / instructor123');
    console.log('   Student: student1@lms.com / student123\n');

    return {
      users,
      courses,
      lessons,
      enrollments,
      progress
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

/**
 * Seed users
 */
const seedUsers = async () => {
  const usersData = [
    {
      name: 'Admin User',
      email: 'admin@lms.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      name: 'Super Admin',
      email: 'superadmin@lms.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      name: 'Dr. Sarah Johnson',
      email: 'instructor1@lms.com',
      password: 'instructor123',
      role: 'instructor'
    },
    {
      name: 'Prof. Michael Chen',
      email: 'instructor2@lms.com',
      password: 'instructor123',
      role: 'instructor'
    },
    {
      name: 'Dr. Emily Brown',
      email: 'instructor3@lms.com',
      password: 'instructor123',
      role: 'instructor'
    },
    {
      name: 'John Doe',
      email: 'student1@lms.com',
      password: 'student123',
      role: 'student'
    },
    {
      name: 'Jane Smith',
      email: 'student2@lms.com',
      password: 'student123',
      role: 'student'
    },
    {
      name: 'Bob Wilson',
      email: 'student3@lms.com',
      password: 'student123',
      role: 'student'
    },
    {
      name: 'Alice Davis',
      email: 'student4@lms.com',
      password: 'student123',
      role: 'student'
    },
    {
      name: 'Charlie Martinez',
      email: 'student5@lms.com',
      password: 'student123',
      role: 'student'
    }
  ];

  const createdUsers = [];
  for (const userData of usersData) {
    const user = await userModel.createUser(userData);
    createdUsers.push(user);
  }

  return createdUsers;
};

/**
 * Seed courses
 */
const seedCourses = (users) => {
  const instructors = users.filter(u => u.role === 'instructor');

  const coursesData = [
    {
      title: 'Complete Node.js Developer',
      description: 'Master Node.js by building real-world applications with Express, MongoDB, and more.',
      instructor: instructors[0].name,
      instructorId: instructors[0].id,
      category: 'Web Development',
      level: 'intermediate',
      duration: 40,
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479'
    },
    {
      title: 'React - The Complete Guide',
      description: 'Dive deep into React.js and learn hooks, context, Redux, and more.',
      instructor: instructors[0].name,
      instructorId: instructors[0].id,
      category: 'Web Development',
      level: 'intermediate',
      duration: 50,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee'
    },
    {
      title: 'Python for Data Science',
      description: 'Learn Python programming and apply it to data science, machine learning, and AI.',
      instructor: instructors[1].name,
      instructorId: instructors[1].id,
      category: 'Data Science',
      level: 'beginner',
      duration: 35,
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935'
    },
    {
      title: 'Machine Learning A-Z',
      description: 'Master Machine Learning algorithms with Python and scikit-learn.',
      instructor: instructors[1].name,
      instructorId: instructors[1].id,
      category: 'Machine Learning',
      level: 'advanced',
      duration: 60,
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c'
    },
    {
      title: 'AWS Cloud Practitioner',
      description: 'Get started with Amazon Web Services and prepare for the AWS certification.',
      instructor: instructors[2].name,
      instructorId: instructors[2].id,
      category: 'Cloud Computing',
      level: 'beginner',
      duration: 30,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa'
    }
  ];

  const createdCourses = [];
  for (const courseData of coursesData) {
    const course = courseModel.createCourse(courseData);
    createdCourses.push(course);
  }

  return createdCourses;
};

/**
 * Seed lessons
 */
const seedLessons = (courses) => {
  const lessonsData = [
    // Node.js Course Lessons
    {
      courseId: courses[0].id,
      title: 'Introduction to Node.js',
      description: 'What is Node.js and why use it?',
      content: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine...',
      duration: 30,
      order: 1
    },
    {
      courseId: courses[0].id,
      title: 'Setting Up Development Environment',
      description: 'Install Node.js, npm, and VS Code',
      content: 'In this lesson, we will set up everything you need...',
      duration: 25,
      order: 2
    },
    {
      courseId: courses[0].id,
      title: 'Understanding npm and Packages',
      description: 'Learn how to use npm to manage dependencies',
      content: 'npm is the package manager for Node.js...',
      duration: 35,
      order: 3
    },
    {
      courseId: courses[0].id,
      title: 'Building Your First Express Server',
      description: 'Create a simple web server with Express.js',
      content: 'Express is a minimal web framework for Node.js...',
      duration: 45,
      order: 4
    },

    // React Course Lessons
    {
      courseId: courses[1].id,
      title: 'React Fundamentals',
      description: 'Understanding components, props, and state',
      content: 'React is a JavaScript library for building user interfaces...',
      duration: 40,
      order: 1
    },
    {
      courseId: courses[1].id,
      title: 'React Hooks Deep Dive',
      description: 'Master useState, useEffect, and custom hooks',
      content: 'Hooks are functions that let you use state in functional components...',
      duration: 50,
      order: 2
    },
    {
      courseId: courses[1].id,
      title: 'State Management with Redux',
      description: 'Learn Redux for managing application state',
      content: 'Redux is a predictable state container for JavaScript apps...',
      duration: 55,
      order: 3
    },

    // Python Course Lessons
    {
      courseId: courses[2].id,
      title: 'Python Basics',
      description: 'Variables, data types, and control structures',
      content: 'Python is a high-level, interpreted programming language...',
      duration: 35,
      order: 1
    },
    {
      courseId: courses[2].id,
      title: 'Data Analysis with Pandas',
      description: 'Working with DataFrames and data manipulation',
      content: 'Pandas is a powerful library for data analysis...',
      duration: 45,
      order: 2
    },
    {
      courseId: courses[2].id,
      title: 'Data Visualization',
      description: 'Creating charts and graphs with Matplotlib',
      content: 'Matplotlib is the foundational plotting library...',
      duration: 40,
      order: 3
    },

    // Machine Learning Course Lessons
    {
      courseId: courses[3].id,
      title: 'Introduction to Machine Learning',
      description: 'ML concepts, supervised vs unsupervised learning',
      content: 'Machine Learning is a subset of AI that focuses on...',
      duration: 50,
      order: 1
    },
    {
      courseId: courses[3].id,
      title: 'Linear Regression',
      description: 'Understanding and implementing linear models',
      content: 'Linear regression is a fundamental ML algorithm...',
      duration: 60,
      order: 2
    },

    // AWS Course Lessons
    {
      courseId: courses[4].id,
      title: 'AWS Overview',
      description: 'Introduction to cloud computing and AWS services',
      content: 'Amazon Web Services is the world\'s leading cloud platform...',
      duration: 30,
      order: 1
    },
    {
      courseId: courses[4].id,
      title: 'EC2 and Compute Services',
      description: 'Launch and manage virtual servers',
      content: 'EC2 (Elastic Compute Cloud) provides scalable computing...',
      duration: 40,
      order: 2
    },
    {
      courseId: courses[4].id,
      title: 'S3 and Storage Services',
      description: 'Object storage and data management',
      content: 'S3 (Simple Storage Service) is object storage built to...',
      duration: 35,
      order: 3
    }
  ];

  const createdLessons = [];
  for (const lessonData of lessonsData) {
    const lesson = lessonModel.createLesson(lessonData);
    createdLessons.push(lesson);
  }

  return createdLessons;
};

/**
 * Seed enrollments
 */
const seedEnrollments = (users, courses) => {
  const students = users.filter(u => u.role === 'student');

  const enrollmentsData = [
    // Student 1 enrollments
    { studentId: students[0].id, courseId: courses[0].id },
    { studentId: students[0].id, courseId: courses[1].id },
    { studentId: students[0].id, courseId: courses[2].id },

    // Student 2 enrollments
    { studentId: students[1].id, courseId: courses[0].id },
    { studentId: students[1].id, courseId: courses[3].id },

    // Student 3 enrollments
    { studentId: students[2].id, courseId: courses[1].id },
    { studentId: students[2].id, courseId: courses[2].id },
    { studentId: students[2].id, courseId: courses[4].id },

    // Student 4 enrollments
    { studentId: students[3].id, courseId: courses[3].id },
    { studentId: students[3].id, courseId: courses[4].id },

    // Student 5 enrollments
    { studentId: students[4].id, courseId: courses[0].id },
    { studentId: students[4].id, courseId: courses[2].id }
  ];

  const createdEnrollments = [];
  for (const enrollmentData of enrollmentsData) {
    const enrollment = enrollmentModel.createEnrollment(enrollmentData);
    createdEnrollments.push(enrollment);
  }

  return createdEnrollments;
};

/**
 * Seed progress records
 */
const seedProgress = (enrollments, lessons) => {
  const progressData = [];

  // Student 1 - completed 2 lessons in Node.js course
  const student1Enroll = enrollments[0];
  const nodeLessons = lessons.filter(l => l.courseId === student1Enroll.courseId).slice(0, 2);
  nodeLessons.forEach(lesson => {
    progressData.push({
      studentId: student1Enroll.studentId,
      courseId: student1Enroll.courseId,
      lessonId: lesson.id,
      timeSpent: lesson.duration
    });
  });

  // Student 1 - completed 1 lesson in React course
  const student1React = enrollments[1];
  const reactLessons = lessons.filter(l => l.courseId === student1React.courseId).slice(0, 1);
  reactLessons.forEach(lesson => {
    progressData.push({
      studentId: student1React.studentId,
      courseId: student1React.courseId,
      lessonId: lesson.id,
      timeSpent: lesson.duration
    });
  });

  // Student 2 - completed 3 lessons in Node.js course
  const student2Node = enrollments[3];
  const nodeLessons2 = lessons.filter(l => l.courseId === student2Node.courseId).slice(0, 3);
  nodeLessons2.forEach(lesson => {
    progressData.push({
      studentId: student2Node.studentId,
      courseId: student2Node.courseId,
      lessonId: lesson.id,
      timeSpent: lesson.duration + 5
    });
  });

  // Student 3 - completed all Python lessons
  const student3Python = enrollments.find(e => 
    e.studentId === enrollments[6].studentId && 
    lessons.some(l => l.courseId === e.courseId && l.title.includes('Python'))
  );
  if (student3Python) {
    const pythonLessons = lessons.filter(l => l.courseId === student3Python.courseId);
    pythonLessons.forEach(lesson => {
      progressData.push({
        studentId: student3Python.studentId,
        courseId: student3Python.courseId,
        lessonId: lesson.id,
        timeSpent: lesson.duration + 10
      });
    });
  }

  const createdProgress = [];
  for (const progress of progressData) {
    const record = progressModel.createProgress(progress);
    createdProgress.push(record);
  }

  return createdProgress;
};

module.exports = {
  seedAllData
};
