import React from 'react'
import experienceImg from '../../images/tagz/experience-card.png'

const ExperienceCard: React.FC = () => {
  return (
    <div className="position-relative">
      <img src={experienceImg} className="experience-card-img" alt="...." />
      <div className="experience-card-text pe-2">
        <p className="font-weight-600 h5 text-white mb-1">MAAT Museum</p>
        <p className="text-white mb-0 font-size-14">Take a journey through the wonderful modern marvel</p>
      </div>
    </div>
  )
}
export default ExperienceCard
