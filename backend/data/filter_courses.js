const fs = require('fs');

// Read the original file
const coursesFile = './data/courses_seed.js';
const originalContent = fs.readFileSync(coursesFile, 'utf8');

// Extract just the array part by removing module.exports = and converting to JSON
const arrayContent = originalContent.replace('module.exports = ', '');

// Parse the array
const courses = JSON.parse(arrayContent);

// Filter out courses with type "free course"
const filteredCourses = courses.filter(course => {
    return !course.resources.some(resource => resource.type === "free course");
});

// Create new content with module.exports
const newContent = `module.exports = ${JSON.stringify(filteredCourses, null, 2)}`;

// Write the filtered content back to file
fs.writeFileSync(coursesFile, newContent);

console.log(`Removed ${courses.length - filteredCourses.length} courses with "free course" type`);