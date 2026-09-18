import React from "react"
import { type Product } from "@/data/products"
import {
  Lightbulb,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Info,
  Leaf,
} from "lucide-react"

export interface ProductAdvice {
  verdictBadge: string
  verdictTitle: string
  verdictDescription: string
  paradoxTitle: string
  paradoxBadge: string
  paradoxTexts: string[]
  paradoxTakeaway: string
  retailTip: string
  dynamicMetrics: Array<{
    label: string
    value: string
    subvalue: string
    status: "good" | "average" | "weak"
  }>
  usageTips: Array<{
    title: string
    description: string
  }>
}

const adviceCache = new WeakMap<Product, ProductAdvice>()

export function getProductAdvice(product: Product): ProductAdvice {
  const cached = adviceCache.get(product)
  if (cached) return cached

  const computed = computeProductAdvice(product)
  adviceCache.set(product, computed)
  return computed
}

const safeScore = (val: unknown): number =>
  typeof val === "number" && !isNaN(val) ? val : 0

const safeFixed1 = (val: unknown): string =>
  safeScore(val).toFixed(1)

function computeProductAdvice(product: Product): ProductAdvice {
  const cat = product.category

  if (cat === "TV & Écrans") {
    const annualEuros = Math.round(safeScore(product.consumption) * 0.25)
    return {
      verdictBadge: "Écran sobre (classe G trompeuse)",
      verdictTitle: "Sobriété énergétique réelle malgré l'étiquette G",
      verdictDescription:
        "Malgré sa note G ou F liée à la refonte réglementaire européenne de 2021, ce téléviseur ne consomme que très peu de watts en marche et reste particulièrement économique à l'usage sur votre facture annuelle.",
      paradoxTitle: `Pourquoi ce téléviseur est classé ${product.energyGrade} tout en consommant très peu de watts ?`,
      paradoxBadge: "Décryptage réglementaire",
      paradoxTexts: [
        "Depuis le 1er mars 2021, l'Union européenne a profondément revu l'échelle de l'étiquette énergie pour les écrans et téléviseurs. Les anciennes classes A+, A++ et A+++ ont été totalement supprimées et les exigences de calcul ont été volontairement durcies pour laisser la place aux futures innovations technologiques d'ici 2030.",
        "Résultat : plus de 90% des téléviseurs 4K, 8K et OLED du marché sont aujourd'hui relégués en classe F ou G. Cette lettre ne signifie absolument pas que l'appareil est énergivore !",
        `En réalité, ce modèle ne consomme que ${product.consumption} Watts en marche (soit ${product.consumption} kWh pour 1 000 heures d'utilisation standard, soit environ 3 à 4 heures par jour pendant un an). Sur votre facture électrique, cela ne représente qu'environ ${annualEuros} € par an (sur la base d'un tarif moyen de 0,25 € / kWh).`,
        "À titre de comparaison, 1 000 heures de télévision consomment moins d'électricité qu'un seul cycle de lave-linge à 90°C ou quelques utilisations d'un four à pyrolyse.",
      ],
      paradoxTakeaway:
        "Le bon réflexe en rayon : Ne vous arrêtez pas à la classe G. Vérifiez la consommation réelle en Watts, activez le capteur de luminosité ambiante et vérifiez que la veille consomme moins de 0,5 Watt.",
      retailTip: `Pour le client : "Ne vous fiez pas à l'étiquette G : avec seulement ${product.consumption}W, ce téléviseur consomme moins qu'une simple ampoule d'autrefois ! Regarder un film de 2h vous coûte à peine 4 centimes d'euro."`,
      dynamicMetrics: [
        {
          label: "Puissance réelle",
          value: `${product.consumption} Watts`,
          subvalue: `~${annualEuros} € / an (pour 1 000h d'usage)`,
          status: safeScore(product.consumption) <= 85 ? "good" : "average",
        },
        {
          label: "Indice Réparabilité",
          value: `${safeFixed1(product.repairability)} / 10`,
          subvalue:
            product.repairability >= 8
              ? "Démontage & pièces faciles"
              : "Réparabilité standard",
          status: product.repairability >= 8 ? "good" : "average",
        },
        {
          label: "Pièces constructeur",
          value: `${product.spareParts} ans garantis`,
          subvalue: "Conformité EU ESPR",
          status: product.spareParts >= 10 ? "good" : "average",
        },
        {
          label: "Recyclabilité certifiée",
          value: `${product.recyclability}%`,
          subvalue: `${product.carbon} kg CO₂eq fabrication`,
          status: product.recyclability >= 82 ? "good" : "average",
        },
      ],
      usageTips: [
        {
          title: "Activez le capteur Eco / Luminosité ambiante",
          description:
            "Le capteur adapte l'intensité de l'éclairage de l'écran à la lumière de votre pièce, ce qui réduit la consommation de 20 à 35% en soirée.",
        },
        {
          title: "Évitez le mode d'image 'Dynamique' ou 'Magasin'",
          description:
            "Ces modes sur-saturent les contrastes et forcent la luminosité au maximum. Choisissez le mode 'Cinéma', 'Standard' ou 'Filmmaker', bien plus naturel et économe.",
        },
        {
          title: "Branchez vos périphériques sur une multiprise coupe-veille",
          description:
            "Box TV, consoles et barres de son consomment en continu lorsqu'elles sont en veille passive. Une multiprise à interrupteur évite ces gaspillages silencieux.",
        },
      ],
    }
  }

  if (cat === "Lave-linge") {
    const annualEuros = Math.round(safeScore(product.consumption) * 0.25 * 2.2)
    return {
      verdictBadge:
        product.energyGrade === "A"
          ? "Excellence énergétique A"
          : "Bon équilibre d'usage",
      verdictTitle: "Lavage basse température & endurance mécanique",
      verdictDescription:
        "80% de l'électricité consommée par un lave-linge sert à chauffer l'eau. En lavant à 30°C ou avec le cycle Éco 40-60, vous réalisez des économies immédiates.",
      paradoxTitle: `Comprendre la classe ${product.energyGrade} et l'étiquette Lave-linge`,
      paradoxBadge: "Décryptage réglementaire",
      paradoxTexts: [
        `La classe ${product.energyGrade} est mesurée officiellement sur 100 cycles du programme normalisé « Éco 40-60 » (${product.consumption} kWh / 100 cycles pour ce modèle).`,
        "Le moteur consomme très peu d'électricité grâce aux technologies modernes à induction. C'est la résistance de chauffe qui absorbe 80% de l'énergie totale d'un lavage.",
        "Un lavage à 30°C consomme environ 0,4 kWh par lessive, contre 1,2 kWh à 60°C et plus de 2 kWh à 90°C. Laver à basse température divise votre facture de lessive par deux.",
        `Avec un indice de réparabilité de ${safeFixed1(product.repairability)}/10 et des pièces garanties ${product.spareParts} ans, les composants d'usure (pompe de vidange, charbons, courroie) sont remplaçables sans remplacer l'appareil complet.`,
      ],
      paradoxTakeaway:
        "Le programme Éco 40-60 prend plus de temps car il lave avec une eau moins chaude mais compense par un brassage plus doux et prolongé : c'est le cycle le plus sobre.",
      retailTip: `Pour le client : "Ce modèle classe ${product.energyGrade} vous fait économiser jusqu'à 60 € par an d'électricité par rapport à un ancien lave-linge de plus de 8 ans."`,
      dynamicMetrics: [
        {
          label: "Consommation Éco 40-60",
          value: `${product.consumption} kWh / 100c`,
          subvalue: `~${annualEuros} € / an (pour 220 cycles)`,
          status: safeScore(product.consumption) <= 46 ? "good" : "average",
        },
        {
          label: "Indice Réparabilité",
          value: `${safeFixed1(product.repairability)} / 10`,
          subvalue: `${product.spareParts} ans de pièces assurées`,
          status: safeScore(product.repairability) >= 8.5 ? "good" : "average",
        },
        {
          label: "Niveau sonore essorage",
          value: `${product.noise} dB`,
          subvalue:
            product.noise <= 72 ? "Moteur silencieux" : "Essorage standard",
          status: product.noise <= 72 ? "good" : "average",
        },
        {
          label: "Recyclabilité matériaux",
          value: `${product.recyclability}%`,
          subvalue: `${product.carbon} kg CO₂eq fabrication`,
          status: product.recyclability >= 88 ? "good" : "average",
        },
      ],
      usageTips: [
        {
          title: "Lavez à 30°C pour le linge quotidien",
          description:
            "Les lessives modernes sont hautement efficaces dès 30°C. Réservez les cycles à 60°C au linge de maison particulièrement souillé.",
        },
        {
          title: "Ne surdosez pas votre détergent",
          description:
            "Un excès de lessive génère un trop-plein de mousse qui force la machine à lancer des cycles de rinçage supplémentaires et encrasse la résistance.",
        },
        {
          title: "Laissez le hublot entrouvert après lavage",
          description:
            "Cela permet à la cuve de s'aérer et évite le développement de moisissures sur les joints en caoutchouc ainsi que les mauvaises odeurs.",
        },
      ],
    }
  }

  if (cat === "Lave-vaisselle") {
    const annualEuros = Math.round(product.consumption * 0.25 * 2.8)
    return {
      verdictBadge: "4x plus sobre qu'à la main",
      verdictTitle: "Économies d'eau massives & hygiène certifiée",
      verdictDescription:
        "Contrairement aux idées reçues, un lave-vaisselle moderne consomme 3 à 4 fois moins d'eau qu'un nettoyage à la main sous le robinet.",
      paradoxTitle:
        "Lave-vaisselle vs Vaisselle à la main : le vrai bilan écologique",
      paradoxBadge: "Décryptage environnemental",
      paradoxTexts: [
        "Faire la vaisselle à la main sous l'eau courante nécessite entre 35 et 50 litres d'eau potable chauffée à chaque fois.",
        `Ce lave-vaisselle n'utilise quant à lui que 9 à 10 litres d'eau par cycle complet, tout en lavant à 50°C ou 65°C pour une hygiène irréprochable.`,
        `Sur une année (environ 280 cycles), utiliser cet appareil permet d'économiser plus de 8 000 litres d'eau potable et plusieurs dizaines de kWh d'électricité pour chauffer l'eau.`,
        `${
          product.noise <= 42
            ? `Avec seulement ${product.noise} dB, cet appareil est remarquablement silencieux et s'intègre parfaitement dans les cuisines ouvertes sur le salon.`
            : `Son niveau sonore de ${product.noise} dB garantit un confort acoustique adapté au quotidien.`
        }`,
      ],
      paradoxTakeaway:
        "Règle d'or : Ne rincez jamais votre vaisselle sous l'eau avant de la mettre dans le lave-vaisselle : cela gaspille de l'eau et nuit à l'action des pastilles.",
      retailTip:
        "Pour le client : \"Ne gaspillez plus d'eau à pré-rincer vos assiettes : un coup de fourchette suffit. Ce lave-vaisselle consomme 4 fois moins d'eau qu'un nettoyage au robinet.\"",
      dynamicMetrics: [
        {
          label: "Consommation électrique",
          value: `${product.consumption} kWh / 100c`,
          subvalue: `~${annualEuros} € / an (pour 280 cycles)`,
          status: product.consumption <= 65 ? "good" : "average",
        },
        {
          label: "Consommation d'eau",
          value: "9 à 10 L / cycle",
          subvalue: "vs 40 L pour un lavage manuel",
          status: "good",
        },
        {
          label: "Niveau sonore",
          value: `${product.noise} dB`,
          subvalue:
            product.noise <= 42 ? "Ultra-silencieux" : "Standard discret",
          status: product.noise <= 42 ? "good" : "average",
        },
        {
          label: "Indice Réparabilité",
          value: `${safeFixed1(product.repairability)} / 10`,
          subvalue: `${product.spareParts} ans de pièces détachées`,
          status: safeScore(product.repairability) >= 8.2 ? "good" : "average",
        },
      ],
      usageTips: [
        {
          title: "Raclez sans pré-rincer à l'eau",
          description:
            "Enlevez les résidus alimentaires solides avec une fourchette. Les agents enzymatiques du détergent ont besoin de salissures pour agir sans mousser à vide.",
        },
        {
          title: "Faites tourner la machine uniquement pleine",
          description:
            "Chaque cycle consomme le même volume d'eau et d'électricité quel que soit le chargement : optimisez toujours le remplissage des paniers.",
        },
        {
          title: "Nettoyez le filtre de cuve une fois par mois",
          description:
            "Un filtre propre évite les odeurs, maintient une pression de lavage optimale et préserve la pompe de vidange sur le long terme.",
        },
      ],
    }
  }

  if (cat === "Réfrigérateur") {
    const annualEuros = Math.round(safeScore(product.consumption) * 0.25)
    return {
      verdictBadge:
        safeScore(product.consumption) <= 145
          ? "Très sobre en continu"
          : "Froid maîtrisé 24h/24",
      verdictTitle: "Le poste n°1 de consommation continue du logement",
      verdictDescription:
        "C'est le seul appareil branché 8 760 heures par an sans interruption : la classe énergétique est ici le critère le plus déterminant pour votre facture sur 10 ans.",
      paradoxTitle:
        "Pourquoi la classe énergétique du réfrigérateur a le plus fort impact financier ?",
      paradoxBadge: "Décryptage réglementaire",
      paradoxTexts: [
        "Contrairement au lave-linge ou au téléviseur qui ne fonctionnent que quelques heures par semaine, le réfrigérateur tourne 24h/24, 7j/7 et 365 jours par an.",
        `Depuis la refonte de l'étiquette énergie en 2021, les classes actuelles A, B, C et D correspondent aux anciens A+++ d'antan. Ce modèle consomme ${product.consumption} kWh / an en classe ${product.energyGrade}, soit un coût d'usage d'environ ${annualEuros} € / an (~${annualEuros * 10} € sur 10 ans).`,
        "La différence de facture sur 10 ans entre un modèle sobre (classe B/C/D) et un modèle énergivore (classe F) dépasse fréquemment 350 € à 500 €, soit une part majeure du prix d'achat du réfrigérateur !",
        `Avec son compresseur moderne et seulement ${product.noise} dB, cet appareil allie efficacité thermique et discrétion sonore.`,
      ],
      paradoxTakeaway:
        "Pour un réfrigérateur, calculez le coût total sur 10 ans : le prix d'achat ne représente souvent que 60% du budget total, le reste étant la facture électrique.",
      retailTip: `Pour le client : "Sur 10 ans, un frigo classe ${product.energyGrade} (${product.consumption} kWh/an) vous fait économiser jusqu'à 300 € d'électricité par rapport à un modèle entrée de gamme moins bien isolé."`,
      dynamicMetrics: [
        {
          label: "Consommation annuelle",
          value: `${product.consumption} kWh / an`,
          subvalue: `~${annualEuros} € / an (fonctionnement 24h/24)`,
          status: safeScore(product.consumption) <= 150 ? "good" : "average",
        },
        {
          label: "Coût estimé sur 10 ans",
          value: `~${annualEuros * 10} €`,
          subvalue: "Électricité cumulée estimée",
          status: safeScore(product.consumption) <= 150 ? "good" : "average",
        },
        {
          label: "Silence de marche",
          value: `${product.noise} dB`,
          subvalue: "Compresseur inverter continu",
          status: safeScore(product.noise) <= 36 ? "good" : "average",
        },
        {
          label: "Indice Réparabilité",
          value: `${safeFixed1(product.repairability)} / 10`,
          subvalue: `${product.spareParts} ans de pièces assurées`,
          status: safeScore(product.repairability) >= 8.2 ? "good" : "average",
        },
      ],
      usageTips: [
        {
          title: "Réglez la température idéale (+4°C / -18°C)",
          description:
            "Chaque degré inférieur à +4°C dans le réfrigérateur augmente sa consommation électrique de 5% sans apporter de bénéfice de conservation supplémentaire.",
        },
        {
          title: "Laissez 5 cm d'aération à l'arrière",
          description:
            "La grille du condenseur à l'arrière doit dissiper les calories extraites de l'intérieur. Une bonne circulation d'air soulage le compresseur.",
        },
        {
          title: "Ne mettez jamais de plats chauds au frais",
          description:
            "Laissez toujours tiédir vos plats cuisinés à température ambiante avant de les stocker, pour éviter que le compresseur ne surconsomme.",
        },
      ],
    }
  }

  // Smartphone
  if (cat === "Smartphone") {
    return {
      verdictBadge:
        safeScore(product.repairability) >= 8.2
          ? "Champion de la réparabilité"
          : "Éco-conception mobile",
      verdictTitle:
        "80% de l'empreinte environnementale se joue à la fabrication",
      verdictDescription:
        "La recharge annuelle d'un smartphone ne coûte que 2 à 3 € d'électricité : l'enjeu écologique majeur est de prolonger sa durée de vie au-delà de 3 ans.",
      paradoxTitle:
        "Smartphone : pourquoi la consommation électrique n'est pas le vrai enjeu ?",
      paradoxBadge: "Décryptage environnemental",
      paradoxTexts: [
        "Recharger un smartphone tous les jours pendant une année entière ne consomme qu'environ 5 à 8 kWh, soit moins de 2 € à 3 € par an sur votre facture d'électricité.",
        `En revanche, la fabrication de ce smartphone a généré ${product.carbon} kg CO₂eq et mobilisé des dizaines de métaux rares (cobalt, lithium, terres rares). La fabrication représente plus de 80% de l'empreinte écologique totale d'un smartphone.`,
        "Par conséquent, doubler la durée d'utilisation d'un smartphone (passer de 2 ans à 4 ans d'usage) divise exactement par deux son impact environnemental annuel.",
        `C'est pourquoi l'indice officiel de réparabilité (${safeFixed1(product.repairability)}/10) et la disponibilité des pièces (${product.spareParts} ans pour batterie et écran) sont les critères environnementaux déterminants.`,
      ],
      paradoxTakeaway:
        "Le smartphone le plus écologique est celui qu'on garde le plus longtemps. Choisir un modèle réparable avec pièces garanties protège votre pouvoir d'achat et la planète.",
      retailTip: `Pour le client : "Avec un indice de réparabilité de ${safeFixed1(product.repairability)}/10 et ${product.spareParts} ans de pièces constructeur, ce modèle garde une forte valeur de revente et se répare facilement en cas de panne de batterie ou casse d'écran."`,
      dynamicMetrics: [
        {
          label: "Autonomie mesurée",
          value: `${product.consumption} heures`,
          subvalue: "Usage polyvalent continu",
          status: safeScore(product.consumption) >= 45 ? "good" : "average",
        },
        {
          label: "Indice Réparabilité",
          value: `${safeFixed1(product.repairability)} / 10`,
          subvalue: `${product.spareParts} ans de pièces détachées`,
          status: safeScore(product.repairability) >= 8.2 ? "good" : "average",
        },
        {
          label: "Empreinte usine",
          value: `${product.carbon} kg CO₂eq`,
          subvalue: "80% de l'empreinte totale",
          status: safeScore(product.carbon) <= 60 ? "good" : "average",
        },
        {
          label: "Recyclabilité certifiée",
          value: `${product.recyclability}%`,
          subvalue: "Filière DEEE & reprise circulaire",
          status: safeScore(product.recyclability) >= 80 ? "good" : "average",
        },
      ],
      usageTips: [
        {
          title: "Activez la protection de charge à 80%",
          description:
            "Limiter la charge maximale à 80-85% préserve la structure chimique des cellules lithium-ion et double la longévité de votre batterie.",
        },
        {
          title: "Installez un verre trempé et une coque",
          description:
            "Les chocs et bris d'écran représentent plus de 70% des motifs de remplacement prématuré. Une bonne protection évite des réparations coûteuses.",
        },
        {
          title: "Préservez la batterie des fortes chaleurs",
          description:
            "Ne laissez pas votre téléphone en plein soleil ou sur un tableau de bord de voiture en été : au-delà de 35°C, la batterie s'use de manière irréversible.",
        },
      ],
    }
  }

  // Catégorie générale / importée (fallback robuste)
  return {
    verdictBadge: "Appareil certifié EU",
    verdictTitle: "Évaluation environnementale & cycle de vie",
    verdictDescription:
      "Appareil référencé avec passeport numérique et critères européens de durabilité et de réparabilité.",
    paradoxTitle: `Critères de durabilité pour cet appareil (${product.category || "Électroménager"})`,
    paradoxBadge: "Passeport Circulaire",
    paradoxTexts: [
      `Cet équipement est certifié sous la référence ${product.certRef || "EU-EPREL"}.`,
      `Son indice de réparabilité officiel est de ${safeFixed1(product.repairability)}/10 avec ${product.spareParts ?? 5} ans de pièces détachées garanties par le constructeur.`,
      `Son empreinte carbone de fabrication est estimée à ${product.carbon ?? 0} kg CO₂eq et son taux de recyclabilité à ${product.recyclability ?? 80}%.`,
    ],
    paradoxTakeaway:
      "Privilégiez toujours l'entretien régulier et la réparation pour maximiser la durée de vie de votre équipement.",
    retailTip: `Pour le client : "Cet appareil bénéficie de ${product.warranty ?? 2} ans de garantie constructeur et d'un indice de réparabilité de ${safeFixed1(product.repairability)}/10."`,
    dynamicMetrics: [
      {
        label: "Consommation",
        value: `${product.consumption ?? 0}`,
        subvalue: "Valeur déclarée constructeur",
        status: "good",
      },
      {
        label: "Indice Réparabilité",
        value: `${safeFixed1(product.repairability)} / 10`,
        subvalue: `${product.spareParts ?? 5} ans pièces`,
        status: safeScore(product.repairability) >= 7 ? "good" : "average",
      },
      {
        label: "Garantie légale",
        value: `${product.warranty ?? 2} ans`,
        subvalue: "Garantie constructeur UE",
        status: "good",
      },
      {
        label: "Recyclabilité",
        value: `${product.recyclability ?? 80}%`,
        subvalue: "Filière circulaire",
        status: "good",
      },
    ],
    usageTips: [
      {
        title: "Suivez les recommandations d'entretien du fabricant",
        description:
          "Un entretien régulier prolonge la durée de vie et maintient les performances d'origine.",
      },
      {
        title: "Pensez à la réparation en cas de dysfonctionnement",
        description:
          "Les pièces détachées sont disponibles pour éviter le remplacement prématuré de votre appareil.",
      },
    ],
  }
}

export const ProductAdviceCard = React.memo(function ProductAdviceCard({
  product,
}: {
  product: Product
}) {
  const advice = getProductAdvice(product)

  return (
    <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden">
      {/* Header with emerald tint */}
      <div className="advice-header p-6 sm:p-7 border-b border-emerald-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Lightbulb className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Conseil & Analyse de l'expert Cyclo</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-0.5">
                {advice.verdictTitle}
              </h2>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-200 shadow-2xs">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            {advice.verdictBadge}
          </span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          {advice.verdictDescription}
        </p>
      </div>

      <div className="p-6 sm:p-7 space-y-6">
        {/* 2-Column Balanced Grid: Paradox & Decryption on left, Practical Tips on right */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Décryptage Réglementaire (7 cols) */}
          <div className="advice-paradox-box lg:col-span-7 rounded-2xl p-5 sm:p-6 border border-amber-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {advice.paradoxBadge}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Méthodologie UE · Sources certifiées ADEME
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {advice.paradoxTitle}
                  </h3>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {advice.paradoxTexts.map((paragraph, idx) => (
                  <p key={idx} className="text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Callout Règle d'or */}
            <div className="advice-takeaway mt-4 pt-3 border-t border-amber-200/60 flex items-start gap-2.5 text-xs p-3 rounded-xl">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <span className="font-semibold leading-relaxed">
                {advice.paradoxTakeaway}
              </span>
            </div>
          </div>

          {/* Right: Conseils Pratiques Cyclo (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Conseils d'usage & Durabilité</span>
            </div>
            <div className="space-y-2.5 flex-1 flex flex-col justify-between">
              {advice.usageTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="advice-tip-card border rounded-2xl p-4 flex-1 flex flex-col justify-start"
                >
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-900 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-200/80 text-emerald-800 text-xs font-black flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="leading-tight text-emerald-950 font-bold">
                      {tip.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
