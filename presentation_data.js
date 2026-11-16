// ==========================================================================
// DATOS DE LA PRESENTACIÓN: INVESTIGACIÓN PP3 - GRUPO C (VERSIÓN 2)
// 100% en Español, sin texto en inglés ni japonés.
// Mantiene todo el texto técnico y la estructura original de "Presentacion".
// ==========================================================================

window.PRESENTATION_DATA = {
  "metadata": {
    "title": "Programación Asistida por Inteligencia Artificial",
    "subtitle": "Investigación Técnica — Grupo C",
    "course": "Prácticas Profesionalizantes III (PP3) · I.S.F.T. N° 179",
    "institution": "I.S.F.T. N° 179 'Dr. Carlos Pellegrini'"
  },
  "slides": [
    // ------------------------------------------------------------------------
    // DIAPOSITIVA 1: PORTADA GENERAL Y EQUIPO DE INVESTIGADORES
    // ------------------------------------------------------------------------
    {
      "slideTitle": "Investigación Grupo C",
      "slideSubtitle": "Programación Asistida por Inteligencia Artificial",
      "type": "cover",
      "author": "Grupo C — Equipo de Investigación",
      "shortTitle": "Portada y Equipo",
      "category": "INTRODUCCIÓN Y EQUIPO",
      "part": "01",
      "theme": {
        "color": "#1e293b",
        "accent": "#6366f1",
        "spineColor": "#1e293b",
        "coverColor": "#0f172a",
        "textColor": "#ffffff",
        "symbol": "equipo"
      },
      "content": {
        "title": "Programación Asistida por Inteligencia Artificial",
        "researchers": [
          {
            "name": "Emmanuel Villalba",
            "topics": "Tema 1: LLM utilizados de manera aislada<br>Tema 2: Agentes de programación y arnés"
          },
          {
            "name": "Lautaro Rasso",
            "topics": "Tema 3: Pruebas automáticas y calidad<br>Tema 4: Seguridad y qué cosas no delegar"
          },
          {
            "name": "Luca Fortin",
            "topics": "Tema 5: Ventajas en el tiempo<br>Tema 6: Desventajas y deuda técnica"
          },
          {
            "name": "Greta Miranda",
            "topics": "Tema 7: Aprendizaje para principiantes<br>Tema 8: El futuro del rol del programador"
          }
        ]
      }
    },

    // ------------------------------------------------------------------------
    // DIAPOSITIVA 2: TEMA 1 - LLM AISLADOS (EMMANUEL VILLALBA)
    // ------------------------------------------------------------------------
    {
      "slideTitle": "Tema 1: Modelos de Lenguaje de Gran Tamaño Utilizados de Manera Aislada",
      "slideSubtitle": "¿Cómo funcionan los LLM de forma aislada y qué limitaciones presentan al programar?",
      "type": "llm_topic",
      "author": "Emmanuel Villalba",
      "shortTitle": "Tema 1: LLM Aislados",
      "category": "TEORÍA Y PROBABILIDADES",
      "part": "02",
      "theme": {
        "color": "#1e40af",
        "accent": "#38bdf8",
        "spineColor": "#1e3a8a",
        "coverColor": "#172554",
        "textColor": "#ffffff",
        "symbol": "cerebro"
      },
      "content": {
        "intro": "Un modelo de lenguaje de gran tamaño (LLM) genera texto palabra por palabra calculando probabilidades estadísticas a partir del texto recibido. Al usarlo de forma aislada para programar, presenta facilidades inmediatas pero también límites claros que tenés que conocer.",
        "tools": "ChatGPT en navegador, Claude web, Gemini web (interacción aislada sin integración al entorno)",
        "howItWorks": "Funciona en una ventana de conversación aislada. No guarda memoria del proyecto completo ni tiene acceso directo a los archivos o terminal del entorno.",
        "pros": [
          "Responde rápido a dudas puntuales sobre sintaxis o funciones específicas.",
          "Explica fragmentos de código pegados en la conversación.",
          "Permite hacer pruebas rápidas de algoritmos aislados sin configurar nada."
        ],
        "limits": [
          "No sabe si el código compila ni si funciona con el resto del proyecto.",
          "Te obliga a copiar y pegar todo el código a mano.",
          "Si el código da error, el modelo no se entera hasta que vos le pegás el mensaje de fallo."
        ]
      }
    },

    // ------------------------------------------------------------------------
    // DIAPOSITIVA 3: TEMA 2 - AGENTES Y ARNÉS (EMMANUEL VILLALBA)
    // ------------------------------------------------------------------------
    {
      "slideTitle": "Tema 2: Agentes Especializados y el Concepto de «Arnés»",
      "slideSubtitle": "De la calculadora de texto a un agente gobernado por reglas fijas",
      "type": "agents_harness_topic",
      "author": "Emmanuel Villalba",
      "shortTitle": "Tema 2: Agentes y Arnés",
      "category": "ARQUITECTURA Y CONTROL",
      "part": "03",
      "theme": {
        "color": "#9a3412",
        "accent": "#fb923c",
        "spineColor": "#7c2d12",
        "coverColor": "#431407",
        "textColor": "#ffffff",
        "symbol": "arnes"
      },
      "content": {
        "agentDef": "Un agente de programación (Cursor, Claude Code, Windsurf) no es un simple chat: está integrado en el editor, lee varios archivos a la vez, propone cambios automáticos y prueba si compilan.",
        "whyHarness": "Por qué se llama 'Arnés': Al igual que en la escalada, el arnés no sube la montaña por vos, pero te sostiene, te marca el camino y evita que te caigas al vacío si resbalás. En programación, el arnés rodea a la IA con reglas estrictas y herramientas controladas.",
        "components": [
          {
            "name": "1. Caja de Pruebas",
            "desc": "La IA trabaja en un espacio de prueba cerrado; si algo se rompe, no afecta al sistema real."
          },
          {
            "name": "2. Filtro de Contexto",
            "desc": "El arnés selecciona solo los archivos que necesita para no confundir a la IA."
          },
          {
            "name": "3. Herramientas Controladas",
            "desc": "Permite usar la terminal o consultar bases de datos, pero con permisos bloqueados."
          },
          {
            "name": "4. Verificadores Automáticos",
            "desc": "Un compilador y corrector de reglas revisa el código antes de mostrarlo."
          }
        ]
      }
    },

    // ------------------------------------------------------------------------
    // DIAPOSITIVA 4: TEMA 3 - PRUEBAS Y CALIDAD (LAUTARO RASSO)
    // ------------------------------------------------------------------------
    {
      "slideTitle": "Tema 3: Pruebas Automáticas y Calidad de Código",
      "slideSubtitle": "¿Puede la IA probar el software? Lo que demostraron las pruebas en Meta",
      "type": "testing_topic",
      "author": "Lautaro Rasso",
      "shortTitle": "Tema 3: Pruebas y Calidad",
      "category": "CALIDAD Y PRUEBAS EN META",
      "part": "04",
      "theme": {
        "color": "#b91c1c",
        "accent": "#f87171",
        "spineColor": "#991b1b",
        "coverColor": "#450a0a",
        "textColor": "#ffffff",
        "symbol": "pruebas"
      },
      "content": {
        "thesis": "La IA puede proponer pruebas útiles, pero jamás puede ser el único juez de la calidad. Tiende a crear pruebas engañosas que siempre dan 'aprobado' aunque el sistema falle.",
        "metaStudy": {
          "title": "Generación Automática de Pruebas Unitarias",
          "context": "Meta probó un sistema de IA para generar automáticamente pruebas sobre el código real de Facebook e Instagram, buscando medir cuántas eran realmente válidas y útiles sin romper el sistema.",
          "stats": [
            { "val": "57%", "desc": "De las pruebas generadas por la IA compilaron y funcionaron sin romperse", "status": "warn" },
            { "val": "25%", "desc": "De las pruebas sirvieron realmente para probar código nuevo del sistema", "status": "info" },
            { "val": "73%", "desc": "Fueron aceptadas porque Meta aplicó filtros automáticos con reglas lógicas", "status": "ok" }
          ],
          "result": "Sin un control estricto de reglas fijas, la IA llena el proyecto de pruebas falsas que dan una engañosa sensación de seguridad."
        },
        "selfHealing": {
          "title": "Corrección Automática de Errores",
          "desc": "La IA es muy buena para corregir errores de tipeo o nombres mal escritos cuando ve el mensaje de error. Pero si el error es de lógica del negocio (por ejemplo, cobrar de menos), casi siempre se equivoca."
        }
      }
    },

    // ------------------------------------------------------------------------
    // DIAPOSITIVA 5: TEMA 4 - SEGURIDAD Y MATRIZ DE DECISIONES (LAUTARO RASSO)
    // ------------------------------------------------------------------------
    {
      "slideTitle": "Tema 4: Seguridad y Matriz de Decisiones",
      "slideSubtitle": "Criterio técnico: qué tareas se pueden delegar y cuáles jamás se deben dejar a la IA",
      "type": "matrix_safety_topic",
      "author": "Lautaro Rasso",
      "shortTitle": "Tema 4: Seguridad y Matriz",
      "category": "SEGURIDAD Y DELEGACIÓN",
      "part": "05",
      "theme": {
        "color": "#047857",
        "accent": "#34d399",
        "spineColor": "#065f46",
        "coverColor": "#022c22",
        "textColor": "#ffffff",
        "symbol": "seguridad"
      },
      "content": {
        "ruleLead": "El informe de la industria DORA lo resume así: 'La IA amplifica lo que ya existe: si el equipo trabaja con orden y buenas prácticas, la IA lo acelera; si el equipo es desordenado, la IA genera mucho más desorden y fallas de seguridad.'",
        "matrix": [
          { "task": "Escribir código repetitivo y estructuras base", "level": "delegable", "label": "Se puede delegar", "reason": "Ahorra tiempo mecánico. Es fácil de revisar con una lectura rápida." },
          { "task": "Convertir formatos de datos (ej. JSON a SQL)", "level": "delegable", "label": "Se puede delegar", "reason": "Es una transformación lógica directa y fácil de verificar automáticamente." },
          { "task": "Redactar borradores de documentación de funciones", "level": "delegable", "label": "Se puede delegar", "reason": "Genera resúmenes claros que luego el programador ajusta en minutos." },
          { "task": "Crear pruebas unitarias para código existente", "level": "supervised", "label": "Revisión obligatoria", "reason": "Hay que revisar que la prueba realmente falle cuando algo anda mal y no apruebe todo a ciegas." },
          { "task": "Reescribir código viejo o complejo", "level": "supervised", "label": "Revisión obligatoria", "reason": "Peligro de romper partes conectadas que funcionaban bien sin darse cuenta." },
          { "task": "Mejorar consultas a bases de datos", "level": "supervised", "label": "Revisión obligatoria", "reason": "Requiere revisar cómo responde el servidor con miles de usuarios conectados." },
          { "task": "Diseño de la arquitectura general", "level": "forbidden", "label": "NUNCA DELEGAR", "reason": "Define el futuro del sistema a largo plazo. La IA solo ve pedacitos aislados." },
          { "task": "Manejo de contraseñas y accesos", "level": "forbidden", "label": "NUNCA DELEGAR", "reason": "La seguridad de los usuarios exige responsabilidad y criterio humano absoluto." },
          { "task": "Leyes de privacidad y datos personales", "level": "forbidden", "label": "NUNCA DELEGAR", "reason": "La responsabilidad legal de cuidar la información de las personas es de los profesionales." },
          { "task": "Aprobación final para poner en marcha el sistema", "level": "forbidden", "label": "NUNCA DELEGAR", "reason": "El visto bueno para salir a producción siempre debe darlo una persona que responda por el resultado." }
        ]
      }
    },

    // ------------------------------------------------------------------------
    // DIAPOSITIVA 6: TEMA 5 - VENTAJAS OPERACIONALES (LUCA FORTIN)
    // ------------------------------------------------------------------------
    {
      "slideTitle": "Tema 5: Ventajas Operacionales y Ahorro de Tiempo",
      "slideSubtitle": "¿Dónde acelera de verdad? Mediciones con programadores reales",
      "type": "pros_overview",
      "author": "Luca Fortin",
      "shortTitle": "Tema 5: Ventajas y Tiempo",
      "category": "MÉTRICAS DE PRODUCTIVIDAD",
      "part": "06",
      "theme": {
        "color": "#16a34a",
        "accent": "#4ade80",
        "spineColor": "#15803d",
        "coverColor": "#052e16",
        "textColor": "#ffffff",
        "symbol": "reloj"
      },
      "content": {
        "lead": "Cuando la tarea es acotada, corta y predecible, la IA ahorra mucho tiempo mecánico de tipeo.",
        "keyStudy": {
          "author": "Experimento con programadores reales — Microsoft y MIT",
          "metric": "+55.8%",
          "metricLabel": "Más rápido en tareas sencillas",
          "desc": "95 desarrolladores crearon un servidor web básico en JavaScript. El grupo con asistencia de IA tardó 71 minutos, contra 161 minutos del grupo sin IA."
        },
        "prosList": [
          {
            "title": "Menos tiempo en tareas mecánicas",
            "desc": "Escribe en segundos funciones típicas, conexiones básicas y plantillas que a mano te llevarían media hora de tipeo."
          },
          {
            "title": "Superar la pantalla en blanco",
            "desc": "Te permite arrancar un proyecto de inmediato teniendo una base lista para empezar a ajustar."
          },
          {
            "title": "Explicación de código ajeno",
            "desc": "Le mostrás una función difícil escrita por otra persona y te explica en español qué hace paso por paso."
          },
          {
            "title": "Sensación de avance continuo",
            "desc": "Encuestas a más de 2.000 programadores demuestran que la mayoría siente que trabaja con mayor comodidad al no trabarse buscando sintaxis."
          }
        ]
      }
    },

    // ------------------------------------------------------------------------
    // DIAPOSITIVA 7: TEMA 6 - DESVENTAJAS TÉCNICAS Y DEUDA TÉCNICA (LUCA FORTIN)
    // ------------------------------------------------------------------------
    {
      "slideTitle": "Tema 6: Desventajas Técnicas y Deuda Técnica",
      "slideSubtitle": "¿Aporta más velocidad o más problemas a largo plazo? Los datos reales",
      "type": "cons_overview",
      "author": "Luca Fortin",
      "shortTitle": "Tema 6: Deuda Técnica",
      "category": "RIESGOS Y DEUDA TÉCNICA",
      "part": "07",
      "theme": {
        "color": "#be185d",
        "accent": "#f472b6",
        "spineColor": "#9d174d",
        "coverColor": "#500724",
        "textColor": "#ffffff",
        "symbol": "alerta"
      },
      "content": {
        "paradoxLead": "En proyectos grandes, entender y arreglar el código confuso que escribió la IA suele llevar más tiempo que haberlo programado uno mismo.",
        "stats": [
          {
            "number": "+19%",
            "label": "Más lentos en proyectos reales",
            "source": "Medición en proyectos reales",
            "detail": "16 desarrolladores senior en 246 tareas reales: con IA tardaron un 19% MÁS de tiempo, aunque creían haber ahorrado un 20%."
          },
          {
            "number": "19.7%",
            "label": "Librerías inventadas que no existen",
            "source": "Auditoría de librerías y paquetes",
            "detail": "En más de 500.000 respuestas de 16 modelos, 1 de cada 5 librerías recomendadas eran falsas. Si las instalás, podés meter virus en tu sistema."
          },
          {
            "number": "~40%",
            "label": "Código con fallas de seguridad",
            "source": "Auditoría de seguridad informática",
            "detail": "Revisaron 1.689 programas generados por IA: 4 de cada 10 tenían agujeros de seguridad graves que permitían hackeos."
          },
          {
            "number": "+281%",
            "label": "Aumento de código sobrante",
            "source": "Medición de deuda técnica y código sobrante",
            "detail": "En el primer mes se genera casi el triple de líneas, pero con el tiempo ese código se vuelve confuso y muy difícil de mantener."
          }
        ],
        "risksSummary": "Peligro del exceso de confianza: Quienes usan IA sin verificar suelen entregar código con más fallas, pero con la falsa sensación de que su código es más seguro."
      }
    },

    // ------------------------------------------------------------------------
    // DIAPOSITIVA 8: TEMA 7 - APRENDIZAJE Y FORMACIÓN (GRETA MIRANDA)
    // ------------------------------------------------------------------------
    {
      "slideTitle": "Tema 7: Aprendizaje de la Programación",
      "slideSubtitle": "¿La IA enseña a programar o genera dependencia? El dilema de la muleta vs el tutor",
      "type": "cognitive_impact",
      "author": "Greta Miranda",
      "shortTitle": "Tema 7: Aprendizaje IA",
      "category": "EDUCACIÓN Y FORMACIÓN",
      "part": "08",
      "theme": {
        "color": "#d97706",
        "accent": "#fcd34d",
        "spineColor": "#b45309",
        "coverColor": "#451a03",
        "textColor": "#ffffff",
        "symbol": "libro"
      },
      "content": {
        "dilemma": "Los estudios en educación demuestran que la IA tiene dos caras: puede ser una gran ayuda para destrabarte o un atajo que te impide aprender a pensar.",
        "twoPaths": [
          {
            "type": "El Camino de la Muleta (Atrofia mental)",
            "behavior": "El estudiante copia la consigna, le pide el código completo a la IA y lo pega sin intentar entenderlo.",
            "impact": "No aprende a razonar paso a paso. El día que la IA da una respuesta rota o el profesor le pide cambiar una línea, se queda totalmente paralizado sin saber qué hacer."
          },
          {
            "type": "El Camino del Tutor Guía (Aceleración real)",
            "behavior": "El estudiante intenta resolver el problema y usa la IA para pedir explicaciones sencillas, entender un error o recibir pistas conceptuales.",
            "impact": "Aprende mucho más rápido porque supera bloqueos típicos de sintaxis, pero manteniendo el control de la lógica y la solución en su cabeza."
          }
        ],
        "warning": "Nota: Quien solo copia lo que hace la IA no aprende a programar; solo aprende a pedir que programen por él."
      }
    },

    // ------------------------------------------------------------------------
    // DIAPOSITIVA 9: TEMA 8 - EL FUTURO DEL ROL PROFESIONAL (GRETA MIRANDA)
    // ------------------------------------------------------------------------
    {
      "slideTitle": "Tema 8: Visión a Futuro del Rol Profesional",
      "slideSubtitle": "¿Nos reemplaza la IA? Del 'tipeador de código' al Director de Orquesta y Auditor",
      "type": "role_evolution",
      "author": "Greta Miranda",
      "shortTitle": "Tema 8: Futuro del Rol",
      "category": "EVOLUCIÓN PROFESIONAL",
      "part": "09",
      "theme": {
        "color": "#6d28d9",
        "accent": "#a78bfa",
        "spineColor": "#5b21b6",
        "coverColor": "#2e1065",
        "textColor": "#ffffff",
        "symbol": "director"
      },
      "content": {
        "lead": "La IA no viene a eliminar a los analistas de sistemas, sino a cambiar por completo las tareas que tienen verdadero valor profesional.",
        "evolution": [
          {
            "era": "El Programador Tradicional (Antes)",
            "role": "Escritor manual de sintaxis",
            "focus": "Memorizar comandos, tipear bucles a mano y buscar errores visuales línea por línea.",
            "value": "Se medía por cuántas líneas de código escribía por día."
          },
          {
            "era": "El Profesional de Sistemas de Hoy y Mañana",
            "role": "Director de orquesta y auditor de calidad",
            "focus": "Diseñar la solución completa, guiar a las herramientas con precisión y auditar que todo sea seguro y mantenible.",
            "value": "Se mide por la solidez del sistema, la seguridad y la solución a las necesidades reales del cliente."
          }
        ],
        "quote": "El valor del profesional hoy no está en escribir código rápido, sino en tener el criterio para saber si el código que generó la máquina es correcto, seguro y sostenible a largo plazo."
      }
    },

    // ------------------------------------------------------------------------
    // DIAPOSITIVA 10: METODOLOGÍA PROFESIONAL DE ASISTENCIA CON IA
    // ------------------------------------------------------------------------
    {
      "slideTitle": "Cómo Trabaja un Profesional de Sistemas con IA",
      "slideSubtitle": "Método, orden previo, pruebas de control y revisión humana obligatoria",
      "type": "professional_workflow",
      "author": "Grupo C — Metodología",
      "shortTitle": "Metodología Profesional",
      "category": "INGENIERÍA Y PROCESOS",
      "part": "10",
      "theme": {
        "color": "#0d9488",
        "accent": "#2dd4bf",
        "spineColor": "#0f766e",
        "coverColor": "#134e4a",
        "textColor": "#ffffff",
        "symbol": "escalera"
      },
      "content": {
        "lead": "El analista de sistemas no programa a ciegas. Usa la IA como un ayudante rápido, pero bajo un proceso de ingeniería bien estructurado.",
        "workflowSteps": [
          {
            "step": "Paso 1: Diseño Previo y Formatos Claros",
            "desc": "Define qué datos se van a recibir, qué formato obligatorio deben tener y qué reglas no se pueden romper ANTES de pedir código."
          },
          {
            "step": "Paso 2: Reglas Claras para la IA",
            "desc": "Configura el editor con reglas fijas: qué versiones usar, qué librerías están prohibidas y cómo debe organizarse el código."
          },
          {
            "step": "Paso 3: Pruebas Automáticas",
            "desc": "Crea pruebas que verifican automáticamente que el programa no falle ante datos incorrectos o situaciones imprevistas."
          },
          {
            "step": "Paso 4: Revisión Línea por Línea",
            "desc": "Lee con atención cada cambio que propone la IA antes de aceptarlo, revisando la seguridad y que no sobre código inútil."
          },
          {
            "step": "Paso 5: Guardado Ordenado y Documentado",
            "desc": "Guarda los cambios con explicaciones claras para que todo el equipo sepa qué se hizo y por qué."
          }
        ]
      }
    },

    // ------------------------------------------------------------------------
    // DIAPOSITIVA 11: DEMOSTRACIÓN: VIBECODING VS PROGRAMACIÓN ASISTIDA (PYTHON)
    // ------------------------------------------------------------------------
    {
      "slideTitle": "Demostración de Código: Vibecoding vs Programación Asistida",
      "slideSubtitle": "Comparación práctica: delegación ciega sin conocimientos técnicos frente al criterio profesional",
      "type": "side_by_side_comparison",
      "author": "Grupo C — Demostración Técnica",
      "shortTitle": "Vibecoding vs Asistida",
      "category": "CÓDIGO Y AUDITORÍA",
      "part": "11",
      "theme": {
        "color": "#475569",
        "accent": "#38bdf8",
        "spineColor": "#334155",
        "coverColor": "#0f172a",
        "textColor": "#ffffff",
        "symbol": "codigo"
      },
      "content": {
        "briefDistinction": "Diferencia fundamental: El vibecoding delega todo a la máquina sin conocimientos técnicos ni control. La programación asistida utiliza la IA como acelerador, pero bajo especificaciones, validación de seguridad y auditoría técnica permanente.",
        "useCase": "Caso Real: Crear la función para iniciar sesión de un usuario y cobrarle una compra aplicando un descuento.",
        "vibe": {
          "title": "Vibecoding (Sin Criterio Técnico)",
          "prompt": "Pedido: \"Hacé una función para que el usuario pueda iniciar sesión y pagar con descuento.\"",
          "scorecard": {
            "vulnerabilities": "4 Fallas Graves (Inyección SQL con f-string, Contraseña en texto plano, Función inventada, Saldo vulnerable)",
            "debt": "Máxima (Todo mezclado en un solo script, imposible de mantener)",
            "tests": "0% de pruebas (Solo probado haciendo clics a mano)",
            "maintainability": "Pésima (Al mínimo cambio, el sistema se rompe)"
          }
        },
        "pro": {
          "title": "Programación Asistida (Criterio Profesional)",
          "prompt": "Pedido estructurado: \"Generar módulo en Python. Validar esquema de entrada con Pydantic. Verificar contraseña con Argon2. Consulta parametrizada con SQLAlchemy. Transacción atómica de base de datos para cobrar con rollback seguro. Incluir pruebas unitarias completas.\"",
          "scorecard": {
            "vulnerabilities": "0 Fallas de seguridad (Protegido contra inyección SQL y contraseñas seguras)",
            "debt": "Controlada (Separado en capas claras con tipado estricto y validaciones)",
            "tests": "100% probado (Pruebas automáticas con Pytest que garantizan que funciona)",
            "maintainability": "Excelente (Fácil de entender, corregir y ampliar por cualquier compañero)"
          }
        }
      }
    },

    // ------------------------------------------------------------------------
    // DIAPOSITIVA 12: CONCLUSIONES FINALES
    // ------------------------------------------------------------------------
    {
      "slideTitle": "Conclusiones Finales de la Investigación",
      "slideSubtitle": "Síntesis técnica de los Temas 1 al 8",
      "type": "synthesis_conclusions",
      "author": "Grupo C — Síntesis General",
      "shortTitle": "Conclusiones Finales",
      "category": "SÍNTESIS Y BALANCE FINAL",
      "part": "12",
      "theme": {
        "color": "#3730a3",
        "accent": "#818cf8",
        "spineColor": "#312e81",
        "coverColor": "#0f172a",
        "textColor": "#ffffff",
        "symbol": "pilares"
      },
      "content": {
        "summaryPillars": [
          {
            "topic": "Temas 1 y 2: Modelos de Lenguaje y Arneses",
            "takeaway": "La IA necesita un arnés con reglas claras. Sola es una calculadora de texto; con un arnés bien configurado se convierte en una herramienta productiva."
          },
          {
            "topic": "Temas 3 y 4: Pruebas Automáticas y Seguridad",
            "takeaway": "La IA no puede ser juez de sus propias pruebas. Diseñar la arquitectura, proteger las claves y autorizar la salida a producción NUNCA se delega a la máquina."
          },
          {
            "topic": "Temas 5 y 6: Ventajas y Deuda Técnica",
            "takeaway": "Acelera tareas repetitivas sencillas (+55%), pero en proyectos grandes puede retrasar (+19%) si no se revisa el código confuso o las librerías falsas."
          },
          {
            "topic": "Temas 7 y 8: Aprendizaje y Evolución del Rol",
            "takeaway": "No debemos usar la IA como muleta para no pensar, sino como tutor. El analista pasa de ser un 'tipeador de código' a un director y revisor de calidad."
          }
        ],
        "finalStatement": "Conclusión: La Inteligencia Artificial no va a reemplazar a los profesionales de sistemas, pero los profesionales de sistemas que sepan usar la IA con criterio técnico, orden y control van a reemplazar a quienes programan a ciegas por sensaciones."
      }
    }
  ]
};
