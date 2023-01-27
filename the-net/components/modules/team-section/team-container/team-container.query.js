export const teamContainer = `_type == 'teamContainer' => {
    _type,
    _key,
    teamContent{
      title,
      subtitle,
      teamMembers{
        slides[]{
          "tabImage": tabImage.asset->url,
          member{
            name,
            "photo": photo.asset->url,
            description,
            contactInfo[]{
              contactType,
              contact
            }
          }
        }
      }
    },
  }`
