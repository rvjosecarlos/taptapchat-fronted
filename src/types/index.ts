import z from "zod";

// Type mensaje
const messageSchema = z.object({
    id: z.string(),
    message: z.string(),
    send: z.boolean(),
    leido: z.boolean(),
    time: z.number(),
    contactId: z.string()
});

// Type lista de contactos
const contactSchema =z.object({
    id: z.string(),
    nameContact: z.string(),
    emailContact: z.string(),
    toList: z.boolean(),
    lastMessage: z.string(),
    online: z.boolean(),
    timeDisconnected: z.number(),
    leido: z.boolean(),
    userId: z.string(),
    imgUrl: z.string().optional()
});



// Type historial de mensajes
const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    imgUrl: z.string().optional()
});

// Type registro de usuario
const registroUser = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
    passwordConfirm: z.string()
});


// Contacto activo
const activeContactSchema = contactSchema.pick({
    id: true,
    nameContact: true,
    online: true,
    timeDisconnected: true,
    imgUrl: true
});

// Respuesta del servidor de datos de la BD
const serverResponse = z.object({
    success: z.boolean(),
    errors: z.array(z.object({
        msg: z.string()
    })).optional(),
    message: z.string().optional(),
    data: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        online: z.boolean(),
        imgUrl: z.string().optional()
    }).optional().or(z.string())
});

// Respuesta del servidor Web SOCKET
const wsServerResponse = z.object({
    type: z.string(),
    originUserId: z.string(),
    destinationUserId: z.string(),
    message: messageSchema,
    updateNameContact: z.string().optional(),
    updateImgUrl: z.string().optional(),
    contacts: z.string()
});

// Backup BD
const bdData = z.object({
    user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string()
    }),
    contact: z.array(z.object({
        nameContact: z.string(),
        leido: z.boolean(),
        id: z.string(),
        toList: z.boolean(),
        lastMessage: z.string(),
        online: z.boolean(),
        userId: z.string(),
        timeDisconnected: z.number()
    })),
    mensajes: z.array(z.object({
        id: z.string(),
        message: z.string(),
        send: z.string(),
        leido: z.string(),
        time: z.number(),
        contactId: z.string()
    }))
});


export type Contact = z.infer<typeof contactSchema>;
export type Message = z.infer<typeof messageSchema>;
export type User = z.infer<typeof userSchema>;
export type ActiveContact = z.infer<typeof activeContactSchema>;
export type RegistroUser = z.infer<typeof registroUser>;
export type ServerResponse = z.infer<typeof serverResponse>;
export type WSServerResponse = z.infer<typeof wsServerResponse>;
export type BDData = z.infer<typeof bdData>;