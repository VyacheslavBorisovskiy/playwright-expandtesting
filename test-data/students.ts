
export interface Student {
  name: string;
  gender: 'Male' | 'Female';
  classLevel: string;
  homeState: string;
  major: string;
  activity: string;
}

export const students: Student[] = [
  {
    name: 'Alice Johnson', gender: 'Female', classLevel: 'Sophomore',
    homeState: 'Texas', major: 'Mathematics', activity: 'Debate Team'
  },
  {
    name: 'Bob Williams', gender: 'Male', classLevel: 'Freshman',
    homeState: 'Florida', major: 'Physics', activity: 'Soccer'
  },
  {
    name: 'Daniel Martinez', gender: 'Male', classLevel: 'Freshman',
    homeState: 'Nevada', major: 'Political Science', activity: 'Football'
  },
  {
    name: 'Emma Brown', gender: 'Female', classLevel: 'Senior',
    homeState: 'Illinois', major: 'Engineering', activity: 'Music Club'
  },
  {
    name: 'Ethan Thomas', gender: 'Male', classLevel: 'Junior',
    homeState: 'Michigan', major: 'Business', activity: 'Basketball'
  },
  {
    name: 'Jane Smith', gender: 'Female', classLevel: 'Junior',
    homeState: 'New York', major: 'Biology', activity: 'Chess Club'
  },
  {
    name: "John Doe", gender: "Male", classLevel: "Senior",
    homeState: "California", major: "Computer Science", activity: "Basketball"
  },
  {
    name: "Michael Davis", gender: "Male", classLevel: "Junior",
    homeState: "Georgia", major: "Chemistry", activity: "Drama"
  },
  {
    name: "Olivia Wilson", gender: "Female", classLevel: "Sophomore",
    homeState: "Ohio", major: "English", activity: "Swimming"
  },
  {
    name: "Sophia Anderson", gender: "Female", classLevel: "Senior",
    homeState: "Arizona", major: "History", activity: "Dance Club"
  }
];