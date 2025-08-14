import {ActionItem, upcomingApointment} from '../utils/types';

const doctorData = {
  Cardiology: [
    {
      name: 'Dr. Ramesh K',
      designation: 'Senior Consultant',
      speciality: 'Neurology',
      image: require('../../assets/images/doc-img.png'),
    },
    {
      name: 'Dr. Sirisha R',
      designation: 'Senior Consultant',
      speciality: 'Cardiology',
      image: require('../../assets/images/doc-img-2.jpg'),
    },
    {
      name: 'Dr. Prashant B',
      designation: 'Senior Consultant',
      speciality: 'Pulmonology',
      image: require('../../assets/images/doc-img-3.jpg'),
    },
  ],
  Neurology: [
    {
      name: 'Dr. Ramesh K',
      designation: 'Senior Consultant',
      speciality: 'Neurology',
      image: require('../../assets/images/doc-img.png'),
    },
    {
      name: 'Dr. Sirisha R',
      designation: 'Senior Consultant',
      speciality: 'Cardiology',
      image: require('../../assets/images/doc-img-2.jpg'),
    },
    {
      name: 'Dr. Prashant B',
      designation: 'Senior Consultant',
      speciality: 'Pulmonology',
      image: require('../../assets/images/doc-img-3.jpg'),
    },
  ],
  Pulmonology: [
    {
      name: 'Dr. Ramesh K',
      designation: 'Senior Consultant',
      speciality: 'Neurology',
      image: require('../../assets/images/doc-img.png'),
    },
    {
      name: 'Dr. Sirisha R',
      designation: 'Senior Consultant',
      speciality: 'Cardiology',
      image: require('../../assets/images/doc-img-2.jpg'),
    },
    {
      name: 'Dr. Prashant B',
      designation: 'Senior Consultant',
      speciality: 'Pulmonology',
      image: require('../../assets/images/doc-img-3.jpg'),
    },
  ],
  Opthomology: [
    {
      name: 'Dr. Ramesh K',
      designation: 'Senior Consultant',
      speciality: 'Neurology',
      image: require('../../assets/images/doc-img.png'),
    },
    {
      name: 'Dr. Sirisha R',
      designation: 'Senior Consultant',
      speciality: 'Cardiology',
      image: require('../../assets/images/doc-img-2.jpg'),
    },
    {
      name: 'Dr. Prashant B',
      designation: 'Senior Consultant',
      speciality: 'Pulmonology',
      image: require('../../assets/images/doc-img-3.jpg'),
    },
  ],
  Urology: [
    {
      name: 'Dr. Ramesh K',
      designation: 'Senior Consultant',
      speciality: 'Neurology',
      image: require('../../assets/images/doc-img.png'),
    },
    {
      name: 'Dr. Sirisha R',
      designation: 'Senior Consultant',
      speciality: 'Cardiology',
      image: require('../../assets/images/doc-img-2.jpg'),
    },
    {
      name: 'Dr. Prashant B',
      designation: 'Senior Consultant',
      speciality: 'Pulmonology',
      image: require('../../assets/images/doc-img-3.jpg'),
    },
  ],
};

const gridData = [
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
  {
    name: 'Neonatal Intensive Care Unit',
    img: require('../../assets/images/neonatal-intensive-care-unit-icon.png'),
  },
];

const upcomingData: upcomingApointment[] = [
  {
    title: 'UPCOMING APPOINTMENTS',
    doctorName: 'Dr. Ramesh Konanki',
    doctorImg: require('../../assets/images/doc-img.png'),
    doctorSpeciality: 'Senior Consultant - Pediatric Neurologist',
    appointmentDateAndTime: 'THU 10 JUL, 04:27 PM',
    appointmentType: 'In Person',
    appointmentNumber: '1023456',
  },
  {
    title: 'UPCOMING APPOINTMENTS',
    doctorName: 'Dr. Ramesh Konanki',
    doctorImg: require('../../assets/images/doc-img.png'),
    doctorSpeciality: 'Senior Consultant - Pediatric Neurologist',
    appointmentDateAndTime: 'THU 10 JUL, 04:27 PM',
    appointmentType: 'In Person',
    appointmentNumber: '1023457',
  },
];

export {doctorData, gridData, upcomingData};
