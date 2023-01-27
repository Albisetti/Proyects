export default {
    title: "2 Columns with images and text",
    description: "Module with 2 images on the left and a list of awards on the right.",
    name: "twoColWithImagesAndText",
    type: "object",
    fields: [
        {
            title: "Polaroid Images",
            name: "polaroidImages",
            type: 'object',
            fields: [
                { title: "First Image", name: "firstImage", type: "image" },
                { title: "Second Image", name: "secondImage", type: "image" }
            ]
        },
        {
            title: "Header",
            name: "header",
            type: "string",
        },
        {
            title: "Awards List",
            name: "awardsText",
            type: "complexPortableText",
        }
    ]
}