'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        features: 'Features',
        pricing: 'Pricing',
        signIn: 'Sign In',
        getStarted: 'Get Started',
        dashboard: 'Go to Dashboard',
      },
      hero: {
        title: {
          part1: 'Transform Any Recipe for Your',
          highlight: 'Thermomix®',
        },
        subtitle: 'Convert recipes from any website into perfect Thermomix instructions. Compatible with TM5, TM6, and upcoming TM7 devices.',
        cta: {
          primary: 'Start Free Trial',
          secondary: 'Watch Demo',
          convertNow: 'Convert Recipe Now',
        },
      },
      stats: {
        recipes: 'Recipes Converted',
        rating: 'Average Rating',
        users: 'Happy Users',
        languages: 'Languages',
      },
      features: {
        title: 'Everything You Need to Convert Recipes',
        subtitle: 'Powerful AI-driven tools to transform any recipe into perfect Thermomix instructions.',
        items: {
          urlToRecipe: {
            title: 'URL to Recipe',
            description: 'Simply paste any recipe URL and watch as we convert it into perfect Thermomix instructions.',
          },
          aiPowered: {
            title: 'AI-Powered',
            description: 'Our AI understands cooking methods and automatically converts them to optimal Thermomix settings.',
          },
          multiLanguage: {
            title: 'Multi-Language',
            description: 'Convert and translate recipes in 7 languages including English, French, German, and more.',
          },
          deviceSpecific: {
            title: 'Device Specific',
            description: 'Optimized conversions for TM5, TM6, and the upcoming TM7 with device-specific features.',
          },
          imageGeneration: {
            title: 'Image Generation',
            description: 'Generate beautiful recipe images when the original does not have one.',
          },
          nutritionInfo: {
            title: 'Nutrition Info',
            description: 'Automatic nutritional calculation for every recipe you convert.',
          },
        },
      },
      pricing: {
        title: 'Simple, Transparent Pricing',
        subtitle: 'Choose the perfect plan for your cooking needs.',
        popular: 'Most Popular',
        free: 'Free',
        year: 'year',
        tiers: {
          free: {
            name: 'Free',
            description: 'Perfect for trying out',
            features: {
              0: '5 conversions per month',
              1: 'Basic recipe storage (25 recipes)',
              2: 'Standard image generation',
              3: 'Community support',
            },
            cta: 'Get Started',
          },
          pro: {
            name: 'Pro',
            description: 'For serious home cooks',
            features: {
              0: 'Unlimited conversions',
              1: 'Unlimited recipe storage',
              2: 'HD image generation',
              3: 'Priority support',
              4: 'Export capabilities',
              5: 'Advanced filters',
            },
            cta: 'Start Free Trial',
          },
          family: {
            name: 'Family',
            description: 'Share with loved ones',
            features: {
              0: 'Everything in Pro',
              1: '5 family member accounts',
              2: 'Shared recipe collections',
              3: 'Meal planning calendar',
              4: 'Shopping list sync',
              5: 'Premium support',
            },
            cta: 'Start Free Trial',
          },
        },
      },
      footer: {
        rights: 'All rights reserved. Not affiliated with Vorwerk.',
        privacy: 'Privacy',
        terms: 'Terms',
        contact: 'Contact',
      },
      dashboard: {
        welcome: 'Welcome back!',
        subtitle: 'Here\'s an overview of your recipe conversion activity.',
        recentRecipes: 'Recent Recipes',
        quickActions: 'Quick Actions',
        usageOverview: 'Usage Overview',
        conversionsUsed: 'Conversions Used',
        upgradeTitle: 'Unlock Unlimited Conversions',
        upgradeDescription: 'Upgrade to Pro for unlimited recipe conversions and more features.',
        upgradeCta: 'Upgrade to Pro',
        nav: {
          dashboard: 'Dashboard',
          convert: 'Convert',
          recipes: 'My Recipes',
          collections: 'Collections',
          mealPlanning: 'Meal Planning',
          analytics: 'Analytics',
          subscription: 'Subscription',
          help: 'Help & Support',
          overview: 'Overview',
          thisMonth: 'This Month',
          conversions: 'Conversions',
          savedRecipes: 'Saved Recipes',
        },
        stats: {
          totalRecipes: 'Total Recipes',
          conversions: 'Conversions',
          collections: 'Collections',
          thisMonth: 'This Month',
        },
        actions: {
          convertRecipe: 'Convert Recipe',
          convertDescription: 'Transform any recipe for your Thermomix',
          viewCollections: 'View Collections',
          collectionsDescription: 'Organize your favorite recipes',
          mealPlanning: 'Meal Planning',
          planningDescription: 'Plan your weekly meals',
        },
      },
    },
  },
  de: {
    translation: {
      nav: {
        features: 'Funktionen',
        pricing: 'Preise',
        signIn: 'Anmelden',
        getStarted: 'Loslegen',
      },
      hero: {
        title: {
          part1: 'Verwandle jedes Rezept für deinen',
          highlight: 'Thermomix®',
        },
        subtitle: 'Konvertiere Rezepte von jeder Website in perfekte Thermomix-Anweisungen. Kompatibel mit TM5, TM6 und dem kommenden TM7.',
        cta: {
          primary: 'Kostenlos testen',
          secondary: 'Demo ansehen',
        },
      },
      stats: {
        recipes: 'Rezepte konvertiert',
        rating: 'Durchschnittsbewertung',
        users: 'Zufriedene Nutzer',
        languages: 'Sprachen',
      },
      features: {
        title: 'Alles was du brauchst für Rezept-Konvertierung',
        subtitle: 'Leistungsstarke KI-Tools um jedes Rezept in perfekte Thermomix-Anweisungen zu verwandeln.',
        items: {
          urlToRecipe: {
            title: 'URL zu Rezept',
            description: 'Füge einfach eine Rezept-URL ein und sieh zu, wie wir sie in perfekte Thermomix-Anweisungen konvertieren.',
          },
          aiPowered: {
            title: 'KI-gesteuert',
            description: 'Unsere KI versteht Kochmethoden und konvertiert sie automatisch zu optimalen Thermomix-Einstellungen.',
          },
          multiLanguage: {
            title: 'Mehrsprachig',
            description: 'Konvertiere und übersetze Rezepte in 7 Sprachen inklusive Deutsch, Englisch, Französisch und mehr.',
          },
          deviceSpecific: {
            title: 'Gerätespezifisch',
            description: 'Optimierte Konvertierungen für TM5, TM6 und den kommenden TM7 mit gerätespezifischen Funktionen.',
          },
          imageGeneration: {
            title: 'Bildgenerierung',
            description: 'Generiere schöne Rezeptbilder wenn das Original keines hat.',
          },
          nutritionInfo: {
            title: 'Nährwerte',
            description: 'Automatische Nährwertberechnung für jedes konvertierte Rezept.',
          },
        },
      },
      pricing: {
        title: 'Einfache, transparente Preise',
        subtitle: 'Wähle den perfekten Plan für deine Kochbedürfnisse.',
        popular: 'Beliebtester',
        free: 'Kostenlos',
        year: 'Jahr',
        tiers: {
          free: {
            name: 'Kostenlos',
            description: 'Perfekt zum Ausprobieren',
            features: {
              0: '5 Konvertierungen pro Monat',
              1: 'Basis Rezeptspeicher (25 Rezepte)',
              2: 'Standard Bildgenerierung',
              3: 'Community Support',
            },
            cta: 'Loslegen',
          },
          pro: {
            name: 'Pro',
            description: 'Für ernsthafte Hobbyköche',
            features: {
              0: 'Unbegrenzte Konvertierungen',
              1: 'Unbegrenzter Rezeptspeicher',
              2: 'HD Bildgenerierung',
              3: 'Prioritätssupport',
              4: 'Export-Funktionen',
              5: 'Erweiterte Filter',
            },
            cta: 'Kostenlos testen',
          },
          family: {
            name: 'Familie',
            description: 'Teile mit deinen Lieben',
            features: {
              0: 'Alles aus Pro',
              1: '5 Familienmitglieder-Konten',
              2: 'Geteilte Rezeptsammlungen',
              3: 'Mahlzeiten-Planungskalender',
              4: 'Einkaufslisten-Sync',
              5: 'Premium Support',
            },
            cta: 'Kostenlos testen',
          },
        },
      },
      footer: {
        rights: 'Alle Rechte vorbehalten. Nicht mit Vorwerk verbunden.',
        privacy: 'Datenschutz',
        terms: 'AGB',
        contact: 'Kontakt',
      },
    },
  },
  fr: {
    translation: {
      nav: {
        features: 'Fonctionnalités',
        pricing: 'Tarifs',
        signIn: 'Se connecter',
        getStarted: 'Commencer',
      },
      hero: {
        title: {
          part1: 'Transformez toute recette pour votre',
          highlight: 'Thermomix®',
        },
        subtitle: 'Convertissez les recettes de n\'importe quel site web en instructions Thermomix parfaites. Compatible avec TM5, TM6 et le prochain TM7.',
        cta: {
          primary: 'Essai gratuit',
          secondary: 'Voir la démo',
        },
      },
      stats: {
        recipes: 'Recettes converties',
        rating: 'Note moyenne',
        users: 'Utilisateurs satisfaits',
        languages: 'Langues',
      },
      features: {
        title: 'Tout ce dont vous avez besoin pour convertir des recettes',
        subtitle: 'Des outils puissants alimentés par l\'IA pour transformer n\'importe quelle recette en instructions Thermomix parfaites.',
        items: {
          urlToRecipe: {
            title: 'URL vers recette',
            description: 'Collez simplement l\'URL d\'une recette et regardez-nous la convertir en instructions Thermomix parfaites.',
          },
          aiPowered: {
            title: 'Alimenté par l\'IA',
            description: 'Notre IA comprend les méthodes de cuisson et les convertit automatiquement en paramètres Thermomix optimaux.',
          },
          multiLanguage: {
            title: 'Multilingue',
            description: 'Convertissez et traduisez des recettes en 7 langues dont le français, l\'anglais, l\'allemand et plus.',
          },
          deviceSpecific: {
            title: 'Spécifique à l\'appareil',
            description: 'Conversions optimisées pour TM5, TM6 et le prochain TM7 avec des fonctionnalités spécifiques à l\'appareil.',
          },
          imageGeneration: {
            title: 'Génération d\'images',
            description: 'Générez de belles images de recettes quand l\'original n\'en a pas.',
          },
          nutritionInfo: {
            title: 'Infos nutritionnelles',
            description: 'Calcul nutritionnel automatique pour chaque recette que vous convertissez.',
          },
        },
      },
      pricing: {
        title: 'Tarification simple et transparente',
        subtitle: 'Choisissez le plan parfait pour vos besoins culinaires.',
        popular: 'Plus populaire',
        free: 'Gratuit',
        year: 'an',
        tiers: {
          free: {
            name: 'Gratuit',
            description: 'Parfait pour essayer',
            features: {
              0: '5 conversions par mois',
              1: 'Stockage de recettes de base (25 recettes)',
              2: 'Génération d\'images standard',
              3: 'Support communautaire',
            },
            cta: 'Commencer',
          },
          pro: {
            name: 'Pro',
            description: 'Pour les cuisiniers sérieux',
            features: {
              0: 'Conversions illimitées',
              1: 'Stockage de recettes illimité',
              2: 'Génération d\'images HD',
              3: 'Support prioritaire',
              4: 'Capacités d\'exportation',
              5: 'Filtres avancés',
            },
            cta: 'Essai gratuit',
          },
          family: {
            name: 'Famille',
            description: 'Partagez avec vos proches',
            features: {
              0: 'Tout dans Pro',
              1: '5 comptes membres de famille',
              2: 'Collections de recettes partagées',
              3: 'Calendrier de planification des repas',
              4: 'Synchronisation de liste de courses',
              5: 'Support premium',
            },
            cta: 'Essai gratuit',
          },
        },
      },
      footer: {
        rights: 'Tous droits réservés. Non affilié à Vorwerk.',
        privacy: 'Confidentialité',
        terms: 'Conditions',
        contact: 'Contact',
      },
    },
  },
  es: {
    translation: {
      nav: {
        features: 'Características',
        pricing: 'Precios',
        signIn: 'Iniciar sesión',
        getStarted: 'Empezar',
      },
      hero: {
        title: {
          part1: 'Transforma cualquier receta para tu',
          highlight: 'Thermomix®',
        },
        subtitle: 'Convierte recetas de cualquier sitio web en instrucciones perfectas para Thermomix. Compatible con TM5, TM6 y el próximo TM7.',
        cta: {
          primary: 'Prueba gratuita',
          secondary: 'Ver demo',
        },
      },
      stats: {
        recipes: 'Recetas convertidas',
        rating: 'Valoración media',
        users: 'Usuarios satisfechos',
        languages: 'Idiomas',
      },
      features: {
        title: 'Todo lo que necesitas para convertir recetas',
        subtitle: 'Herramientas potentes impulsadas por IA para transformar cualquier receta en instrucciones perfectas para Thermomix.',
        items: {
          urlToRecipe: {
            title: 'URL a receta',
            description: 'Simplemente pega cualquier URL de receta y míranos convertirla en instrucciones perfectas para Thermomix.',
          },
          aiPowered: {
            title: 'Impulsado por IA',
            description: 'Nuestra IA entiende los métodos de cocción y los convierte automáticamente a configuraciones óptimas de Thermomix.',
          },
          multiLanguage: {
            title: 'Multiidioma',
            description: 'Convierte y traduce recetas en 7 idiomas incluyendo español, inglés, alemán y más.',
          },
          deviceSpecific: {
            title: 'Específico del dispositivo',
            description: 'Conversiones optimizadas para TM5, TM6 y el próximo TM7 con características específicas del dispositivo.',
          },
          imageGeneration: {
            title: 'Generación de imágenes',
            description: 'Genera hermosas imágenes de recetas cuando el original no tiene una.',
          },
          nutritionInfo: {
            title: 'Info nutricional',
            description: 'Cálculo nutricional automático para cada receta que conviertas.',
          },
        },
      },
      pricing: {
        title: 'Precios simples y transparentes',
        subtitle: 'Elige el plan perfecto para tus necesidades culinarias.',
        popular: 'Más popular',
        free: 'Gratis',
        year: 'año',
        tiers: {
          free: {
            name: 'Gratis',
            description: 'Perfecto para probar',
            features: {
              0: '5 conversiones por mes',
              1: 'Almacenamiento básico de recetas (25 recetas)',
              2: 'Generación de imágenes estándar',
              3: 'Soporte comunitario',
            },
            cta: 'Empezar',
          },
          pro: {
            name: 'Pro',
            description: 'Para cocineros serios',
            features: {
              0: 'Conversiones ilimitadas',
              1: 'Almacenamiento ilimitado de recetas',
              2: 'Generación de imágenes HD',
              3: 'Soporte prioritario',
              4: 'Capacidades de exportación',
              5: 'Filtros avanzados',
            },
            cta: 'Prueba gratuita',
          },
          family: {
            name: 'Familia',
            description: 'Comparte con tus seres queridos',
            features: {
              0: 'Todo en Pro',
              1: '5 cuentas de miembros familiares',
              2: 'Colecciones de recetas compartidas',
              3: 'Calendario de planificación de comidas',
              4: 'Sincronización de lista de compras',
              5: 'Soporte premium',
            },
            cta: 'Prueba gratuita',
          },
        },
      },
      footer: {
        rights: 'Todos los derechos reservados. No afiliado con Vorwerk.',
        privacy: 'Privacidad',
        terms: 'Términos',
        contact: 'Contacto',
      },
    },
  },
  pl: {
    translation: {
      nav: {
        features: 'Funkcje',
        pricing: 'Cennik',
        signIn: 'Zaloguj się',
        getStarted: 'Rozpocznij',
      },
      hero: {
        title: {
          part1: 'Przekształć każdy przepis dla swojego',
          highlight: 'Thermomix®',
        },
        subtitle: 'Konwertuj przepisy z dowolnej strony internetowej na perfekcyjne instrukcje Thermomix. Kompatybilny z TM5, TM6 i nadchodzącym TM7.',
        cta: {
          primary: 'Bezpłatny okres próbny',
          secondary: 'Zobacz demo',
        },
      },
      stats: {
        recipes: 'Przepisy skonwertowane',
        rating: 'Średnia ocena',
        users: 'Zadowoleni użytkownicy',
        languages: 'Języki',
      },
      features: {
        title: 'Wszystko czego potrzebujesz do konwersji przepisów',
        subtitle: 'Potężne narzędzia napędzane AI do przekształcania każdego przepisu w perfekcyjne instrukcje Thermomix.',
        items: {
          urlToRecipe: {
            title: 'URL do przepisu',
            description: 'Po prostu wklej dowolny URL przepisu i patrz jak konwertujemy go na perfekcyjne instrukcje Thermomix.',
          },
          aiPowered: {
            title: 'Napędzane AI',
            description: 'Nasza AI rozumie metody gotowania i automatycznie konwertuje je na optymalne ustawienia Thermomix.',
          },
          multiLanguage: {
            title: 'Wielojęzyczne',
            description: 'Konwertuj i tłumacz przepisy w 7 językach włączając polski, angielski, niemiecki i więcej.',
          },
          deviceSpecific: {
            title: 'Specyficzne dla urządzenia',
            description: 'Zoptymalizowane konwersje dla TM5, TM6 i nadchodzącego TM7 z funkcjami specyficznymi dla urządzenia.',
          },
          imageGeneration: {
            title: 'Generowanie obrazów',
            description: 'Generuj piękne obrazy przepisów gdy oryginał ich nie ma.',
          },
          nutritionInfo: {
            title: 'Informacje żywieniowe',
            description: 'Automatyczne obliczanie wartości odżywczych dla każdego konwertowanego przepisu.',
          },
        },
      },
      pricing: {
        title: 'Proste, przejrzyste ceny',
        subtitle: 'Wybierz idealny plan dla swoich potrzeb kulinarnych.',
        popular: 'Najpopularniejszy',
        free: 'Darmowy',
        year: 'rok',
        tiers: {
          free: {
            name: 'Darmowy',
            description: 'Idealny do wypróbowania',
            features: {
              0: '5 konwersji miesięcznie',
              1: 'Podstawowe przechowywanie przepisów (25 przepisów)',
              2: 'Standardowe generowanie obrazów',
              3: 'Wsparcie społeczności',
            },
            cta: 'Rozpocznij',
          },
          pro: {
            name: 'Pro',
            description: 'Dla poważnych kucharzy domowych',
            features: {
              0: 'Nieograniczone konwersje',
              1: 'Nieograniczone przechowywanie przepisów',
              2: 'Generowanie obrazów HD',
              3: 'Priorytetowe wsparcie',
              4: 'Możliwości eksportu',
              5: 'Zaawansowane filtry',
            },
            cta: 'Bezpłatny okres próbny',
          },
          family: {
            name: 'Rodzina',
            description: 'Dziel się z bliskimi',
            features: {
              0: 'Wszystko z Pro',
              1: '5 kont członków rodziny',
              2: 'Udostępniane kolekcje przepisów',
              3: 'Kalendarz planowania posiłków',
              4: 'Synchronizacja listy zakupów',
              5: 'Wsparcie premium',
            },
            cta: 'Bezpłatny okres próbny',
          },
        },
      },
      footer: {
        rights: 'Wszystkie prawa zastrzeżone. Nie jest powiązane z Vorwerk.',
        privacy: 'Prywatność',
        terms: 'Warunki',
        contact: 'Kontakt',
      },
    },
  },
  cs: {
    translation: {
      nav: {
        features: 'Funkce',
        pricing: 'Ceny',
        signIn: 'Přihlásit se',
        getStarted: 'Začít',
      },
      hero: {
        title: {
          part1: 'Přeměňte jakýkoli recept pro váš',
          highlight: 'Thermomix®',
        },
        subtitle: 'Převádějte recepty z jakékoli webové stránky na dokonalé instrukce pro Thermomix. Kompatibilní s TM5, TM6 a nadcházejícím TM7.',
        cta: {
          primary: 'Zkušební verze zdarma',
          secondary: 'Podívat se na demo',
        },
      },
      stats: {
        recipes: 'Převedené recepty',
        rating: 'Průměrné hodnocení',
        users: 'Spokojení uživatelé',
        languages: 'Jazyky',
      },
      features: {
        title: 'Vše co potřebujete pro převod receptů',
        subtitle: 'Výkonné nástroje poháněné AI pro přeměnu jakéhokoli receptu na dokonalé instrukce pro Thermomix.',
        items: {
          urlToRecipe: {
            title: 'URL na recept',
            description: 'Jednoduše vložte jakoukoliv URL receptu a sledujte jak ji převádíme na dokonalé instrukce pro Thermomix.',
          },
          aiPowered: {
            title: 'Poháněno AI',
            description: 'Naše AI rozumí metodám vaření a automaticky je převádí na optimální nastavení Thermomix.',
          },
          multiLanguage: {
            title: 'Vícejazyčné',
            description: 'Převádějte a překládejte recepty v 7 jazycích včetně češtiny, angličtiny, němčiny a dalších.',
          },
          deviceSpecific: {
            title: 'Specifické pro zařízení',
            description: 'Optimalizované převody pro TM5, TM6 a nadcházející TM7 s funkcemi specifickými pro zařízení.',
          },
          imageGeneration: {
            title: 'Generování obrázků',
            description: 'Generujte krásné obrázky receptů když originál žádný nemá.',
          },
          nutritionInfo: {
            title: 'Výživové informace',
            description: 'Automatický výpočet výživových hodnot pro každý převedený recept.',
          },
        },
      },
      pricing: {
        title: 'Jednoduché, transparentní ceny',
        subtitle: 'Vyberte si perfektní plán pro vaše kulinářské potřeby.',
        popular: 'Nejpopulárnější',
        free: 'Zdarma',
        year: 'rok',
        tiers: {
          free: {
            name: 'Zdarma',
            description: 'Perfektní pro vyzkoušení',
            features: {
              0: '5 převodů měsíčně',
              1: 'Základní úložiště receptů (25 receptů)',
              2: 'Standardní generování obrázků',
              3: 'Komunitní podpora',
            },
            cta: 'Začít',
          },
          pro: {
            name: 'Pro',
            description: 'Pro vážné domácí kuchaře',
            features: {
              0: 'Neomezené převody',
              1: 'Neomezené úložiště receptů',
              2: 'HD generování obrázků',
              3: 'Prioritní podpora',
              4: 'Exportní možnosti',
              5: 'Pokročilé filtry',
            },
            cta: 'Zkušební verze zdarma',
          },
          family: {
            name: 'Rodina',
            description: 'Sdílejte s blízkými',
            features: {
              0: 'Vše z Pro',
              1: '5 rodinných účtů',
              2: 'Sdílené kolekce receptů',
              3: 'Kalendář plánování jídel',
              4: 'Synchronizace nákupního seznamu',
              5: 'Prémiová podpora',
            },
            cta: 'Zkušební verze zdarma',
          },
        },
      },
      footer: {
        rights: 'Všechna práva vyhrazena. Není spojeno s Vorwerk.',
        privacy: 'Soukromí',
        terms: 'Podmínky',
        contact: 'Kontakt',
      },
    },
  },
  it: {
    translation: {
      nav: {
        features: 'Caratteristiche',
        pricing: 'Prezzi',
        signIn: 'Accedi',
        getStarted: 'Inizia',
      },
      hero: {
        title: {
          part1: 'Trasforma qualsiasi ricetta per il tuo',
          highlight: 'Thermomix®',
        },
        subtitle: 'Converti ricette da qualsiasi sito web in perfette istruzioni Thermomix. Compatibile con TM5, TM6 e il prossimo TM7.',
        cta: {
          primary: 'Prova gratuita',
          secondary: 'Guarda demo',
        },
      },
      stats: {
        recipes: 'Ricette convertite',
        rating: 'Valutazione media',
        users: 'Utenti soddisfatti',
        languages: 'Lingue',
      },
      features: {
        title: 'Tutto ciò di cui hai bisogno per convertire ricette',
        subtitle: 'Strumenti potenti alimentati dall\'AI per trasformare qualsiasi ricetta in perfette istruzioni Thermomix.',
        items: {
          urlToRecipe: {
            title: 'URL a ricetta',
            description: 'Incolla semplicemente qualsiasi URL di ricetta e guardaci convertirla in perfette istruzioni Thermomix.',
          },
          aiPowered: {
            title: 'Alimentato da AI',
            description: 'La nostra AI comprende i metodi di cottura e li converte automaticamente in impostazioni Thermomix ottimali.',
          },
          multiLanguage: {
            title: 'Multilingua',
            description: 'Converti e traduci ricette in 7 lingue inclusi italiano, inglese, tedesco e altro.',
          },
          deviceSpecific: {
            title: 'Specifico per dispositivo',
            description: 'Conversioni ottimizzate per TM5, TM6 e il prossimo TM7 con caratteristiche specifiche del dispositivo.',
          },
          imageGeneration: {
            title: 'Generazione immagini',
            description: 'Genera bellissime immagini di ricette quando l\'originale non ne ha una.',
          },
          nutritionInfo: {
            title: 'Info nutrizionali',
            description: 'Calcolo nutrizionale automatico per ogni ricetta che converti.',
          },
        },
      },
      pricing: {
        title: 'Prezzi semplici e trasparenti',
        subtitle: 'Scegli il piano perfetto per le tue esigenze culinarie.',
        popular: 'Più popolare',
        free: 'Gratuito',
        year: 'anno',
        tiers: {
          free: {
            name: 'Gratuito',
            description: 'Perfetto per provare',
            features: {
              0: '5 conversioni al mese',
              1: 'Archiviazione ricette di base (25 ricette)',
              2: 'Generazione immagini standard',
              3: 'Supporto della comunità',
            },
            cta: 'Inizia',
          },
          pro: {
            name: 'Pro',
            description: 'Per cuochi casalinghi seri',
            features: {
              0: 'Conversioni illimitate',
              1: 'Archiviazione ricette illimitata',
              2: 'Generazione immagini HD',
              3: 'Supporto prioritario',
              4: 'Capacità di esportazione',
              5: 'Filtri avanzati',
            },
            cta: 'Prova gratuita',
          },
          family: {
            name: 'Famiglia',
            description: 'Condividi con i tuoi cari',
            features: {
              0: 'Tutto in Pro',
              1: '5 account membri famiglia',
              2: 'Collezioni ricette condivise',
              3: 'Calendario pianificazione pasti',
              4: 'Sincronizzazione lista spesa',
              5: 'Supporto premium',
            },
            cta: 'Prova gratuita',
          },
        },
      },
      footer: {
        rights: 'Tutti i diritti riservati. Non affiliato con Vorwerk.',
        privacy: 'Privacy',
        terms: 'Termini',
        contact: 'Contatto',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;