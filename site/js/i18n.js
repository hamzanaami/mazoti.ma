/* Interface text in Arabic (default), French and English.
   One entry per key, three languages side by side, so translations stay in step.
   {name} placeholders are filled by app.js with numbers formatted for the language.
   Arabic and French drafts need review by native speakers (see the footer note). */
window.MAZOTI_STRINGS = {
  "doc.title": { ar: "mazoti.ma", fr: "mazoti.ma", en: "mazoti.ma" },
  "doc.description": {
    ar: "شفافية أسعار الوقود في المغرب: ثمن المحطة مقارنة بكلفة الشراء والضرائب والهوامش.",
    fr: "Transparence des prix des carburants au Maroc : prix à la pompe face au coût d'achat, aux taxes et aux marges.",
    en: "Fuel price transparency for Morocco: the pump price against purchase cost, taxes and margins."
  },
  "skip": { ar: "انتقل إلى المحتوى", fr: "Aller au contenu", en: "Skip to content" },
  "brand.tag": {
    ar: "شفافية أسعار الوقود في المغرب",
    fr: "Transparence des prix des carburants au Maroc",
    en: "Fuel price transparency for Morocco"
  },
  "theme.toggle": { ar: "تبديل الوضع الداكن", fr: "Changer de thème", en: "Toggle dark mode" },
  "lang.label": { ar: "اللغة", fr: "Langue", en: "Language" },
  "nav.label": { ar: "أقسام الصفحة", fr: "Sections de la page", en: "Page sections" },

  /* Navigation */
  "nav.structure": { ar: "تركيبة الثمن", fr: "Structure du prix", en: "Price structure" },
  "nav.builder": { ar: "حاسبة الثمن", fr: "Simulateur", en: "Price builder" },
  "nav.passthrough": { ar: "انتقال الأسعار", fr: "Répercussion", en: "Pass-through" },
  "nav.stocks": { ar: "المخزون", fr: "Stocks", en: "Stocks" },
  "nav.validation": { ar: "التحقق", fr: "Validation", en: "Validation" },
  "nav.method": { ar: "المنهجية", fr: "Méthode", en: "Method" },
  "nav.roadmap": { ar: "خارطة الطريق", fr: "Feuille de route", en: "Roadmap" },
  "nav.sources": { ar: "المصادر", fr: "Sources", en: "Sources" },

  /* Hero */
  "hero.eyebrow": {
    ar: "مشروع بحثي مفتوح · المغرب",
    fr: "Projet de recherche ouvert · Maroc",
    en: "Open research project · Morocco"
  },
  "hero.title": {
    ar: "ماذا يوجد داخل ثمن لتر الوقود؟",
    fr: "Que contient le prix d'un litre de carburant ?",
    en: "What is inside the price of a litre of fuel?"
  },
  "hero.lede": {
    ar: "يقارن «مازوطي» بين ما ندفعه في محطة الوقود وكلفة شراء الوقود في الأسواق الدولية، حتى يرى الجميع كم من الثمن هو كلفة المنتوج، وكم هو ضرائب، وكم هو هوامش.",
    fr: "mazoti.ma compare ce que l'on paie à la pompe avec ce que coûte le carburant sur les marchés internationaux, pour que chacun voie la part du produit, celle des taxes et celle des marges.",
    en: "mazoti.ma compares what people pay at the pump with what the fuel costs on world markets, so anyone can see how much of the price is product cost, how much is tax and how much is margin."
  },
  "hero.status.title": { ar: "أين وصل المشروع؟", fr: "Où en est le projet ?", en: "Where the project stands" },
  "hero.status.body": {
    ar: "المرحلة 0–1: النظرية والتحقق. <strong>لا توجد بعد بيانات أسعار مباشرة.</strong> الأرقام في هذه الصفحة إما منشورة من طرف مجلس المنافسة، أو مستنتجة من نموذجنا، أو توضيحية فقط. كل رقم يحمل علامة تبيّن نوعه.",
    fr: "Phase 0–1 : théorie et validation. <strong>Pas encore de données de prix en direct.</strong> Les chiffres de cette page sont soit publiés par le Conseil de la concurrence, soit déduits de notre modèle, soit simplement illustratifs. Chaque chiffre porte une étiquette qui le précise.",
    en: "Phase 0–1: theory and validation. <strong>There is no live price data yet.</strong> The numbers on this page are either published by the Competition Council, implied by our model, or purely illustrative. Every number carries a label that says which."
  },
  "hero.card.title": {
    ar: "لتر غازوال · متوسط الربع الأخير من 2025",
    fr: "Un litre de gasoil · moyenne du T4 2025",
    en: "One litre of diesel · Q4 2025 average"
  },
  "hero.card.more": { ar: "كيف يُبنى هذا الثمن", fr: "Comment ce prix se construit", en: "How this price is built" },

  /* Provenance labels */
  "legend.title": { ar: "كيف تقرأ العلامات", fr: "Comment lire les étiquettes", en: "How to read the labels" },
  "prov.cc": { ar: "مجلس المنافسة", fr: "Publié (CC)", en: "CC-reported" },
  "prov.cc.desc": {
    ar: "رقم منشور في تقرير لمجلس المنافسة.",
    fr: "Chiffre publié dans un rapport du Conseil de la concurrence.",
    en: "Published in a Competition Council report."
  },
  "prov.model": { ar: "مستنتج من النموذج", fr: "Déduit du modèle", en: "Model-implied" },
  "prov.model.desc": {
    ar: "غير منشور؛ نستنتجه من الفرق بين أسعار منشورة. تقدير وليس رقما محاسبيا.",
    fr: "Non publié : nous le déduisons d'écarts entre prix publiés. Une estimation, pas un chiffre comptable.",
    en: "Not published: we infer it from gaps between published prices. An estimate, not an accounting figure."
  },
  "prov.press": { ar: "صحافة / قانون", fr: "Presse / loi", en: "Press / legal" },
  "prov.press.desc": {
    ar: "منقول عن الصحافة، أو عن نص قانوني لم نتحقق منه بعد في مصدره الأصلي.",
    fr: "Rapporté par la presse, ou tiré d'un texte légal pas encore vérifié à la source.",
    en: "Reported by the press, or from a legal text not yet checked against the primary source."
  },
  "prov.illus": { ar: "توضيحي", fr: "Illustratif", en: "Illustrative" },
  "prov.illus.desc": {
    ar: "قيم مصطنعة لشرح آلية، وليست بيانات حقيقية.",
    fr: "Valeurs inventées pour expliquer un mécanisme, pas des données réelles.",
    en: "Made-up values that explain a mechanism, not real data."
  },

  /* Context */
  "ctx.title": { ar: "السياق", fr: "Contexte", en: "Context" },
  "ctx.liberalisation": {
    ar: "تحرير أسعار الوقود بالكامل",
    fr: "Libéralisation totale des prix des carburants",
    en: "Fuel prices fully liberalised"
  },
  "ctx.revisions.value": { ar: "1 و16", fr: "1er et 16", en: "1st & 16th" },
  "ctx.revisions": {
    ar: "من كل شهر: موعدا مراجعة الأسعار",
    fr: "de chaque mois : dates de révision des prix",
    en: "of each month: the price revision dates"
  },
  "ctx.settlement": {
    ar: "اتفاق تصالحي بين مجلس المنافسة وتسع شركات توزيع (نونبر 2023)",
    fr: "Accord transactionnel entre le Conseil de la concurrence et neuf distributeurs (nov. 2023)",
    en: "Settlement between the Competition Council and nine distributors (Nov 2023)"
  },
  "ctx.distributors": {
    ar: "شركات توزيع يتتبعها مجلس المنافسة في تقارير فصلية",
    fr: "distributeurs suivis par le Conseil de la concurrence dans des rapports trimestriels",
    en: "distributors followed by the Competition Council in quarterly reports"
  },

  /* Verification status */
  "st.verified": { ar: "موثَّق", fr: "vérifié", en: "verified" },
  "st.seen": { ar: "اطُّلع عليه", fr: "consulté", en: "seen" },
  "st.secondary": { ar: "ثانوي", fr: "secondaire", en: "secondary" },
  "st.to_verify": { ar: "للتحقق", fr: "à vérifier", en: "to verify" },
  "st.from_memory": { ar: "من الذاكرة", fr: "de mémoire", en: "from memory" },
  "st.illustrative": { ar: "توضيحي", fr: "illustratif", en: "illustrative" },
  "st.verified.desc": {
    ar: "فتحنا الوثيقة الأصلية وتحققنا من المعلومة.",
    fr: "Document primaire ouvert, fait vérifié.",
    en: "Primary document opened and the fact checked."
  },
  "st.seen.desc": {
    ar: "رأينا العنوان أو الملخص، ولم نقرأ الوثيقة كاملة.",
    fr: "Titre ou résumé vu, document pas lu en entier.",
    en: "Title or abstract seen, not read in full."
  },
  "st.secondary.desc": {
    ar: "نقلته الصحافة عن مصدر أصلي لم نراجعه بعد.",
    fr: "Rapporté par la presse ; source primaire pas encore vérifiée.",
    en: "Press report of a primary source we have not checked yet."
  },
  "st.to_verify.desc": {
    ar: "فرضية أو معلومة ما زال يجب التحقق منها.",
    fr: "Hypothèse ou fait encore à vérifier.",
    en: "Assumption or fact still to check."
  },
  "st.from_memory.desc": {
    ar: "مرجع كلاسيكي يجب التأكد من تفاصيله قبل الاستشهاد به.",
    fr: "Référence classique à confirmer avant de la citer.",
    en: "Classic reference to confirm before citing."
  },

  /* Units: {x} is an already formatted number */
  "unit.madl": { ar: "{x} درهم/لتر", fr: "{x} DH/L", en: "{x} MAD/L" },
  "unit.madl.short": { ar: "درهم/لتر", fr: "DH/L", en: "MAD/L" },
  "unit.mad": { ar: "{x} درهم", fr: "{x} DH", en: "{x} MAD" },
  "unit.mad.short": { ar: "درهم", fr: "DH", en: "MAD" },
  "unit.bn_mad": { ar: "{x} مليار درهم", fr: "{x} Md DH", en: "{x} bn MAD" },
  "unit.days": { ar: "{x} يوما", fr: "{x} jours", en: "{x} days" },
  "unit.usd_t": { ar: "دولار/طن", fr: "USD/t", en: "USD/t" },
  "unit.mad_usd": { ar: "درهم للدولار", fr: "MAD par USD", en: "MAD per USD" },
  "unit.kg_l": { ar: "كغ/لتر", fr: "kg/L", en: "kg/L" },
  "unit.ratio": { ar: "نسبة", fr: "ratio", en: "ratio" },

  /* Products */
  "product.gasoil": { ar: "الغازوال", fr: "Gasoil", en: "Diesel" },
  "product.ssp": { ar: "البنزين", fr: "Super sans plomb", en: "Gasoline" },
  "product.choose": { ar: "اختر نوع الوقود", fr: "Choisir le carburant", en: "Choose the fuel" },

  /* Price components */
  "comp.cif": { ar: "السعر الدولي (CIF)", fr: "Cotation internationale (CIF)", en: "World price (CIF)" },
  "comp.cif.desc": {
    ar: "سعر المنتوج المكرر في السوق الدولية، شاملا الشحن والتأمين، قبل الضرائب.",
    fr: "Prix du produit raffiné sur le marché international, fret et assurance compris, avant taxes.",
    en: "Price of the refined product on world markets, freight and insurance included, before tax."
  },
  "comp.approach": { ar: "كلفة الإيصال", fr: "Frais d'approche", en: "Approach costs" },
  "comp.approach.desc": {
    ar: "الميناء والتفريغ والتخزين والتمويل. غير منشورة: نستنتجها.",
    fr: "Port, déchargement, stockage, financement. Non publiés : déduits.",
    en: "Port, unloading, storage, financing. Not published: inferred."
  },
  "comp.tic": { ar: "الضريبة الداخلية على الاستهلاك", fr: "TIC (taxe intérieure de consommation)", en: "Consumption tax (TIC)" },
  "comp.tic.desc": {
    ar: "مبلغ ثابت عن كل لتر، لا يتغير مع الأسعار.",
    fr: "Montant fixe par litre, qui ne varie pas avec les prix.",
    en: "A fixed amount per litre that does not move with prices."
  },
  "comp.gross_margin": { ar: "هامش شركة التوزيع", fr: "Marge du distributeur", en: "Distributor margin" },
  "comp.gross_margin.desc": {
    ar: "الهامش الإجمالي للموزع: سعر التفويت ناقص كلفة الشراء.",
    fr: "Marge brute du distributeur : prix de cession moins coût d'achat.",
    en: "Distributor gross margin: cession price minus purchase cost."
  },
  "comp.station_margin": { ar: "هامش المحطة", fr: "Marge de la station", en: "Station margin" },
  "comp.station_margin.desc": {
    ar: "ما تربحه المحطة فوق سعر التفويت. غير منشور: نستنتجه.",
    fr: "Ce que gagne la station au-dessus du prix de cession. Non publié : déduit.",
    en: "What the station earns above the cession price. Not published: inferred."
  },
  "comp.vat": { ar: "الضريبة على القيمة المضافة", fr: "TVA", en: "VAT" },
  "comp.vat.desc": {
    ar: "نسبتها 10%، وتُطبَّق على كل ما سبق بما فيه الضريبة الداخلية على الاستهلاك.",
    fr: "Au taux de 10 %, elle s'applique à tout ce qui précède, TIC comprise.",
    en: "At 10%, charged on everything above, including the TIC."
  },
  "sub.purchase_cost": { ar: "كلفة الشراء", fr: "Coût d'achat", en: "Purchase cost" },
  "sub.cession_price": { ar: "سعر التفويت للمحطة", fr: "Prix de cession", en: "Cession price" },
  "sub.ex_vat": { ar: "الثمن قبل الضريبة على القيمة المضافة", fr: "Prix hors TVA", en: "Price before VAT" },
  "sub.pump": { ar: "ثمن البيع في المحطة", fr: "Prix à la pompe", en: "Pump price" },
  "sub.desc": {
    ar: "مجموع ما سبق.",
    fr: "Somme de ce qui précède.",
    en: "Sum of the rows above."
  },

  /* Groups */
  "grp.product_cost": { ar: "كلفة المنتوج", fr: "Coût du produit", en: "Product cost" },
  "grp.taxes": { ar: "الضرائب", fr: "Taxes", en: "Taxes" },
  "grp.margins": { ar: "الهوامش", fr: "Marges", en: "Margins" },
  "grp.subtotal": { ar: "مجموع جزئي", fr: "Sous-total", en: "Subtotal" },

  /* Common */
  "common.show_table": { ar: "عرض كجدول", fr: "Afficher en tableau", en: "Show as table" },
  "common.hide_table": { ar: "إخفاء الجدول", fr: "Masquer le tableau", en: "Hide table" },
  "common.source": { ar: "المصدر", fr: "Source", en: "Source" },
  "common.sources": { ar: "المصادر", fr: "Sources", en: "Sources" },
  "common.as_of": { ar: "بتاريخ {d}", fr: "au {d}", en: "as of {d}" },
  "common.reset": { ar: "إعادة الضبط", fr: "Réinitialiser", en: "Reset" },
  "common.component": { ar: "المكوّن", fr: "Composante", en: "Component" },
  "common.value": { ar: "القيمة", fr: "Valeur", en: "Value" },
  "common.label": { ar: "النوع", fr: "Étiquette", en: "Label" },
  "common.share": { ar: "الحصة", fr: "Part", en: "Share" },
  "common.share_of_pump": { ar: "{x} من ثمن المحطة", fr: "{x} du prix à la pompe", en: "{x} of the pump price" },
  "common.equations": { ar: "المعادلات", fr: "Les équations", en: "The equations" },
  "common.fortnight_n": { ar: "الفترة {x}", fr: "Quinzaine {x}", en: "Fortnight {x}" },

  /* Section 1: structure */
  "s1.title": { ar: "أين يذهب درهمك؟", fr: "Où va votre dirham ?", en: "Where does your dirham go?" },
  "s1.lede": {
    ar: "متوسط ثمن لتر واحد خلال الربع الأخير من 2025، كما نشره مجلس المنافسة، مفصّلا بواسطة نموذجنا.",
    fr: "Prix moyen d'un litre au 4e trimestre 2025, publié par le Conseil de la concurrence et décomposé par notre modèle.",
    en: "Average price of one litre in Q4 2025, as published by the Competition Council and broken down by our model."
  },
  "s1.pump_label": {
    ar: "متوسط ثمن المحطة، الربع الأخير من 2025",
    fr: "Prix moyen à la pompe, T4 2025",
    en: "Average pump price, Q4 2025"
  },
  "s1.split_title": { ar: "ثلاثة أجزاء", fr: "En trois parts", en: "In three parts" },
  "s1.waterfall_title": {
    ar: "من السعر الدولي إلى ثمن المحطة",
    fr: "Du prix international au prix à la pompe",
    en: "From world price to pump price"
  },
  "s1.waterfall_sub": {
    ar: "كل سطر يضيف مكوّنا؛ الأشرطة الرمادية مجاميع جزئية.",
    fr: "Chaque ligne ajoute une composante ; les barres grises sont des sous-totaux.",
    en: "Each row adds one component; grey bars are subtotals."
  },
  "s1.point.taxes": {
    ar: "الضرائب تمثل <strong>{x}</strong> من ثمن المحطة.",
    fr: "Les taxes pèsent <strong>{x}</strong> du prix à la pompe.",
    en: "Taxes are <strong>{x}</strong> of the pump price."
  },
  "s1.point.tic": {
    ar: "الضريبة الداخلية على الاستهلاك مبلغ ثابت ({x})، لذلك تنخفض حصتها عندما يرتفع الثمن.",
    fr: "La TIC est un montant fixe ({x}) : sa part baisse quand le prix monte.",
    en: "The TIC is a fixed amount ({x}), so its share falls when the price rises."
  },
  "s1.point.implied": {
    ar: "كلفة الإيصال وهامش المحطة غير منشورين: نستنتجهما من الفرق بين الأسعار المنشورة.",
    fr: "Les frais d'approche et la marge de la station ne sont pas publiés : nous les déduisons des écarts entre prix publiés.",
    en: "Approach costs and the station margin are not published: we infer them from the gaps between published prices."
  },
  "s1.note.margin": {
    ar: "ملاحظة: هامش الموزع هنا ({a}) هو الفرق بين متوسطين. الرقم المرجّح الذي ينشره مجلس المنافسة هو {b}.",
    fr: "Note : la marge du distributeur affichée ici ({a}) est une différence de deux moyennes. Le chiffre pondéré publié par le Conseil est {b}.",
    en: "Note: the distributor margin here ({a}) is a difference of two averages. The weighted figure the Council publishes is {b}."
  },
  "s1.eq.caption": {
    ar: "c: السعر الدولي، a: كلفة الإيصال، θ: الضريبة الداخلية على الاستهلاك، m: هامش الموزع، r: هامش المحطة، τ: نسبة الضريبة على القيمة المضافة (0,10)، P: ثمن المحطة.",
    fr: "c : cotation CIF, a : frais d'approche, θ : TIC, m : marge du distributeur, r : marge de la station, τ : taux de TVA (0,10), P : prix à la pompe.",
    en: "c: CIF quotation, a: approach costs, θ: TIC, m: distributor margin, r: station margin, τ: VAT rate (0.10), P: pump price."
  },
  "s1.eq.share": {
    ar: "حصة الضرائب تنخفض حين يرتفع الثمن لأن θ ثابتة:",
    fr: "La part des taxes baisse quand le prix monte, car θ est fixe :",
    en: "The tax share falls as the price rises, because θ is fixed:"
  },

  /* Section 2: builder */
  "s2.title": { ar: "ابنِ ثمن المحطة بنفسك", fr: "Construisez vous-même le prix à la pompe", en: "Build a pump price yourself" },
  "s2.lede": {
    ar: "حرّك المؤشرات لترى كيف يتفاعل الثمن. الضرائب يحددها القانون؛ الباقي يتغير مع الأسواق وقرارات الشركات. القيم الأولية هي متوسطات الربع الأخير من 2025.",
    fr: "Déplacez les curseurs pour voir réagir le prix. Les taxes sont fixées par la loi ; le reste suit les marchés et les décisions des entreprises. Valeurs de départ : moyennes du T4 2025.",
    en: "Move the sliders to see how the price reacts. Taxes are set by law; the rest moves with markets and company decisions. Starting values are the Q4 2025 averages."
  },
  "s2.fixed": { ar: "ثابت بالقانون", fr: "Fixé par la loi", en: "Fixed by law" },
  "s2.result": { ar: "ثمن المحطة المحسوب", fr: "Prix à la pompe calculé", en: "Calculated pump price" },
  "s2.vs_ref": {
    ar: "{x} مقارنة بمتوسط الربع الأخير من 2025",
    fr: "{x} par rapport à la moyenne du T4 2025",
    en: "{x} vs the Q4 2025 average"
  },
  "s2.same_as_ref": {
    ar: "مطابق لمتوسط الربع الأخير من 2025",
    fr: "Identique à la moyenne du T4 2025",
    en: "Same as the Q4 2025 average"
  },
  "s2.tax_share": { ar: "حصة الضرائب: {x}", fr: "Part des taxes : {x}", en: "Tax share: {x}" },
  "s2.rule": {
    ar: "قاعدة مهمة: كل <strong>{a}</strong> زيادة في السعر الدولي تصبح <strong>{b}</strong> في المحطة عند الانتقال الكامل، لأن الضريبة على القيمة المضافة تُضاف فوقها.",
    fr: "Règle clé : une hausse de <strong>{a}</strong> du prix international devient <strong>{b}</strong> à la pompe en cas de répercussion complète, car la TVA s'y ajoute.",
    en: "Key rule: a <strong>{a}</strong> rise in the world price becomes <strong>{b}</strong> at the pump under full pass-through, because VAT comes on top."
  },
  "s2.convert.title": {
    ar: "انطلاقا من سعر دولي بالدولار للطن",
    fr: "À partir d'une cotation en dollars par tonne",
    en: "From a world quotation in dollars per tonne"
  },
  "s2.convert.quote": { ar: "السعر الدولي", fr: "Cotation", en: "Quotation" },
  "s2.convert.fx": { ar: "سعر صرف الدولار", fr: "Taux de change", en: "Exchange rate" },
  "s2.convert.density": { ar: "الكثافة", fr: "Densité", en: "Density" },
  "s2.convert.use": { ar: "استعمل هذه القيمة", fr: "Utiliser cette valeur", en: "Use this value" },
  "s2.convert.note": {
    ar: "القيم الأولية مثال من اختبارات المشروع، وليست بيانات سوق. الكثافة قيمة مرجعية من الكتب (للتحقق).",
    fr: "Valeurs de départ : exemple tiré des tests du projet, pas des données de marché. Densité : valeur de manuel (à vérifier).",
    en: "Starting values are an example from the project's tests, not market data. Density is a textbook value (to verify)."
  },
  "s2.chart.title": {
    ar: "حصة الضرائب تنخفض كلما ارتفع السعر الدولي",
    fr: "La part des taxes baisse quand le prix international monte",
    en: "The tax share falls as the world price rises"
  },
  "s2.chart.sub": {
    ar: "حصة الضرائب من ثمن المحطة حسب السعر الدولي، مع باقي القيم كما ضبطتها. بالرمادي: الوقود الآخر بقيم الربع الأخير من 2025.",
    fr: "Part des taxes dans le prix à la pompe selon le prix international, autres valeurs telles que réglées. En gris : l'autre carburant aux valeurs du T4 2025.",
    en: "Taxes as a share of the pump price as the world price varies, other inputs as set above. Grey: the other fuel at Q4 2025 values."
  },
  "s2.chart.x": { ar: "السعر الدولي (درهم/لتر)", fr: "Prix international (DH/L)", en: "World price (MAD/L)" },
  "s2.chart.you": { ar: "اختيارك", fr: "Votre réglage", en: "Your setting" },
  "s2.chart.other": { ar: "{x} (الربع الأخير 2025)", fr: "{x} (T4 2025)", en: "{x} (Q4 2025)" },

  /* Section 3: pass-through */
  "s3.title": {
    ar: "كم من تغيّر السعر الدولي يصل إلى المحطة؟",
    fr: "Quelle part d'une variation du prix mondial arrive à la pompe ?",
    en: "How much of a world price change reaches the pump?"
  },
  "s3.lede": {
    ar: "«انتقال الأسعار» هو حصة تغيّر الكلفة التي تظهر في ثمن البيع. وبما أن الضريبة على القيمة المضافة تُضاف فوق الكلفة، فإن الانتقال الكامل لزيادة درهم واحد في الكلفة يساوي 1,10 درهم في المحطة.",
    fr: "La répercussion est la part d'une variation du coût qui se retrouve dans le prix. Comme la TVA s'ajoute au coût, une répercussion complète d'une hausse de 1 DH du coût donne 1,10 DH à la pompe.",
    en: "Pass-through is the share of a cost change that shows up in the price. Because VAT is added on top of the cost, full pass-through of a 1 MAD cost rise is 1.10 MAD at the pump."
  },
  "s3.trap.title": { ar: "فخ الضريبة على القيمة المضافة", fr: "Le piège de la TVA", en: "The VAT trap" },
  "s3.trap.body": {
    ar: "إذا قارنّا تغيّر ثمن المحطة (مع الضريبة) بتغيّر الكلفة (بدون ضريبة)، تتضخم النسبة بـ10%. لذلك نعرض النسبتين.",
    fr: "Comparer la variation du prix à la pompe (TVA comprise) à celle du coût (hors TVA) gonfle le ratio de 10 %. Nous montrons donc les deux.",
    en: "Comparing the pump-price change (with VAT) with the cost change (without VAT) inflates the ratio by 10%. So we show both."
  },
  "s3.chart.title": { ar: "حالة بداية مارس 2026", fr: "L'épisode de début mars 2026", en: "The early March 2026 episode" },
  "s3.chart.sub": {
    ar: "نسبة الانتقال لكل نوع وقود: كما نُشرت، وبعد تصحيح أثر الضريبة على القيمة المضافة.",
    fr: "Taux de répercussion par carburant : tel que publié, et corrigé de la TVA.",
    en: "Pass-through by fuel: as published, and adjusted for VAT."
  },
  "s3.series.raw": {
    ar: "كما نُشرت (المحطة مع الضريبة ÷ الكلفة بدونها)",
    fr: "Tel que publié (pompe TTC ÷ coût HT)",
    en: "As published (pump incl. VAT ÷ cost excl. VAT)"
  },
  "s3.series.adj": {
    ar: "بعد التصحيح (÷ 1,10 × الكلفة)",
    fr: "Corrigé de la TVA (÷ 1,10 × coût)",
    en: "VAT-adjusted (÷ 1.10 × cost)"
  },
  "s3.full": { ar: "انتقال كامل", fr: "Répercussion complète", en: "Full pass-through" },
  "s3.episode": {
    ar: "{p}: ارتفعت الكلفة الدولية بـ<strong>{a}</strong> وارتفع ثمن المحطة بـ<strong>{b}</strong>.",
    fr: "{p} : coût international <strong>{a}</strong>, prix à la pompe <strong>{b}</strong>.",
    en: "{p}: world cost <strong>{a}</strong>, pump price <strong>{b}</strong>."
  },
  "s3.hypothesis": {
    ar: "فرضية يجب تأكيدها (المهمة 1.1): أن النسبة المنشورة تقارن ثمن المحطة مع الضريبة بكلفة بدون ضريبة. استنتجنا ذلك من رقم {x} المنشور.",
    fr: "Hypothèse à confirmer (tâche 1.1) : le ratio publié compare un prix à la pompe TTC à un coût HT. Nous l'avons déduit du chiffre publié de {x}.",
    en: "Hypothesis to confirm (task 1.1): the published ratio compares a pump price incl. VAT with a cost excl. VAT. We inferred this from the published {x}."
  },
  "s3.calc.title": { ar: "احسبها بنفسك", fr: "Calculez vous-même", en: "Work it out yourself" },
  "s3.calc.dcif": {
    ar: "تغيّر الكلفة الدولية (بدون ضريبة)",
    fr: "Variation du coût international (HT)",
    en: "Change in world cost (excl. VAT)"
  },
  "s3.calc.dpump": {
    ar: "تغيّر ثمن المحطة (مع الضريبة)",
    fr: "Variation du prix à la pompe (TTC)",
    en: "Change in pump price (incl. VAT)"
  },
  "s3.calc.raw": { ar: "النسبة الخام", fr: "Ratio brut", en: "Raw ratio" },
  "s3.calc.adj": { ar: "النسبة المصححة", fr: "Ratio corrigé", en: "VAT-adjusted ratio" },
  "s3.calc.full": {
    ar: "الانتقال الكامل كان سيعني {x} في المحطة.",
    fr: "Une répercussion complète aurait donné {x} à la pompe.",
    en: "Full pass-through would have meant {x} at the pump."
  },
  "s3.calc.invalid": {
    ar: "أدخل تغيّرا في الكلفة لا يساوي صفرا.",
    fr: "Saisissez une variation de coût non nulle.",
    en: "Enter a non-zero cost change."
  },
  "s3.asym.title": { ar: "صواريخ وريش", fr: "Fusées et plumes", en: "Rockets and feathers" },
  "s3.asym.body": {
    ar: "يقال إن الأسعار ترتفع كالصاروخ وتنزل كالريشة. هذا نمط إحصائي يمكن قياسه، وله تفسيرات عدة (المخزون، كلفة البحث عن أرخص محطة، قوة السوق)، ولا يثبت في حد ذاته أي نية. سنقيسه في المرحلة 3.",
    fr: "On dit que les prix montent comme des fusées et descendent comme des plumes. C'est un schéma statistique mesurable, aux explications multiples (stocks, coûts de recherche, pouvoir de marché), qui ne prouve à lui seul aucune intention. Nous le mesurerons en phase 3.",
    en: "Prices are said to rise like rockets and fall like feathers. It is a measurable statistical pattern with several possible explanations (stocks, search costs, market power), and on its own it proves no intent. We will measure it in phase 3."
  },

  /* Section 4: stocks */
  "s4.title": {
    ar: "لماذا يؤخّر المخزون تغيّر الأسعار؟",
    fr: "Pourquoi les stocks retardent les variations de prix",
    en: "Why stocks delay price changes"
  },
  "s4.lede": {
    ar: "تبيع شركات التوزيع من مخزون اشترته سابقا. كلفتها المحاسبية متوسط لمشترياتها الماضية، فتتحرك أبطأ من كلفة الاستبدال اليوم. المثال أسفله بأسعار مصطنعة على مستوى الغازوال.",
    fr: "Les distributeurs vendent un stock acheté plus tôt. Leur coût comptable est une moyenne des achats passés : il bouge plus lentement que le coût de remplacement du jour. L'exemple ci-dessous utilise des prix inventés, au niveau du gasoil.",
    en: "Distributors sell from stock bought earlier. Their book cost is an average of past purchases, so it moves more slowly than today's replacement cost. The example below uses made-up prices at diesel levels."
  },
  "s4.days": { ar: "أيام المخزون", fr: "Jours de stock", en: "Days of stock" },
  "s4.weight": {
    ar: "يُجدَّد {x} من المخزون كل أسبوعين",
    fr: "{x} du stock renouvelé chaque quinzaine",
    en: "{x} of the stock renewed each fortnight"
  },
  "s4.rule": {
    ar: "على أي أساس تحدد الشركة سعر التفويت؟",
    fr: "Sur quelle base le distributeur fixe-t-il son prix ?",
    en: "What does the distributor price on?"
  },
  "s4.rule.replacement": { ar: "كلفة الاستبدال اليوم", fr: "Le coût de remplacement", en: "Today's replacement cost" },
  "s4.rule.book": { ar: "الكلفة المحاسبية (المتوسط)", fr: "Le coût comptable (moyen)", en: "The book (average) cost" },
  "s4.chart1.title": { ar: "الكلفة عن كل لتر (بدون الضريبة على القيمة المضافة)", fr: "Coût par litre (hors TVA)", en: "Cost per litre (excl. VAT)" },
  "s4.series.replacement": { ar: "كلفة الاستبدال اليوم", fr: "Coût de remplacement", en: "Replacement cost today" },
  "s4.series.book": { ar: "الكلفة المحاسبية (متوسط المخزون)", fr: "Coût comptable (moyenne du stock)", en: "Book cost (stock average)" },
  "s4.chart2.title": { ar: "هامش الموزع عن كل لتر", fr: "Marge du distributeur par litre", en: "Distributor margin per litre" },
  "s4.series.m_repl": { ar: "الهامش بكلفة الاستبدال", fr: "Marge au coût de remplacement", en: "Margin at replacement cost" },
  "s4.series.m_book": { ar: "الهامش في الحسابات", fr: "Marge comptable", en: "Margin on the books" },
  "s4.x": { ar: "الفترة (أسبوعان)", fr: "Quinzaine", en: "Fortnight" },
  "s4.takeaway": {
    ar: "<strong>عندما تنخفض الأسعار الدولية</strong>، تبقى الكلفة المحاسبية أعلى من كلفة اليوم لمدة، فيبدو الهامش في الحسابات منكمشا حتى لو كان الهامش بكلفة الاستبدال عاديا. <strong>وعندما ترتفع</strong>، يحدث العكس. المقارنة المنصفة تعرض الهامشين معا ولا تخلط بينهما.",
    fr: "<strong>Quand les prix mondiaux baissent</strong>, le coût comptable reste un temps au-dessus du coût du jour : la marge comptable paraît comprimée même si la marge au coût de remplacement est normale. <strong>Quand ils montent</strong>, c'est l'inverse. Une comparaison honnête montre les deux, sans les confondre.",
    en: "<strong>When world prices fall</strong>, the book cost stays above today's cost for a while, so the margin on the books looks squeezed even if the margin at replacement cost is normal. <strong>When they rise</strong>, the reverse happens. A fair comparison shows both and does not mix them up."
  },
  "s4.facts": {
    ar: "للمقارنة: الحد الأدنى القانوني للمخزون {a} (للتحقق)، وأُفيد بمخزون يكفي {b} للغازوال و{c} للبنزين (صحافة).",
    fr: "Repères : stock minimum légal de {a} (à vérifier) ; stocks rapportés de {b} pour le gasoil et {c} pour le SSP (presse).",
    en: "For reference: the legal minimum stock is {a} (to verify); reported stocks were {b} for diesel and {c} for gasoline (press)."
  },

  /* Section 5: validation */
  "s5.title": {
    ar: "هل يعيد النموذج إنتاج الأرقام الرسمية؟",
    fr: "Le modèle retrouve-t-il les chiffres officiels ?",
    en: "Does the model reproduce the official figures?"
  },
  "s5.lede": {
    ar: "قبل أن نثق في النموذج، يجب أن يعيد إنتاج ما ينشره مجلس المنافسة. هذه نتيجة الاختبار على أرقام الربع الأخير من 2025.",
    fr: "Avant de faire confiance au modèle, il doit retrouver ce que publie le Conseil de la concurrence. Voici le test sur les chiffres du T4 2025.",
    en: "Before we trust the model, it has to reproduce what the Competition Council publishes. Here is the check on the Q4 2025 figures."
  },
  "s5.col.product": { ar: "الوقود", fr: "Carburant", en: "Fuel" },
  "s5.col.check": { ar: "الاختبار", fr: "Contrôle", en: "Check" },
  "s5.col.model": { ar: "النموذج", fr: "Modèle", en: "Model" },
  "s5.col.reference": { ar: "المرجع", fr: "Référence", en: "Reference" },
  "s5.col.result": { ar: "النتيجة", fr: "Résultat", en: "Result" },
  "s5.q.approach": {
    ar: "كلفة الإيصال المستنتجة صغيرة وموجبة",
    fr: "Frais d'approche déduits petits et positifs",
    en: "Implied approach cost is small and positive"
  },
  "s5.q.gross_margin": {
    ar: "هامش الموزع مقارنة بالرقم المرجّح للمجلس",
    fr: "Marge du distributeur face au chiffre pondéré du Conseil",
    en: "Distributor margin vs the Council's weighted figure"
  },
  "s5.q.station_margin": {
    ar: "هامش المحطة المستنتج معقول",
    fr: "Marge de station déduite plausible",
    en: "Implied station margin is plausible"
  },
  "s5.q.tax_share": {
    ar: "حصة الضرائب مقارنة بما نشره المجلس (الربع الأخير 2024)",
    fr: "Part des taxes face à celle publiée par le Conseil (T4 2024)",
    en: "Tax share vs the Council's published share (Q4 2024)"
  },
  "s5.q.roundtrip": {
    ar: "النموذج المباشر والعكسي يعطيان نفس ثمن المحطة",
    fr: "Les modèles direct et inverse donnent le même prix",
    en: "Forward and inverse models give the same pump price"
  },
  "s5.range": { ar: "بين {a} و{b}", fr: "entre {a} et {b}", en: "between {a} and {b}" },
  "s5.weighted": { ar: "الرقم المرجّح: {x}", fr: "pondéré : {x}", en: "weighted: {x}" },
  "s5.pass": { ar: "ناجح", fr: "réussi", en: "pass" },
  "s5.fail": { ar: "فاشل", fr: "échec", en: "fail" },
  "s5.info": { ar: "للعلم", fr: "pour info", en: "for information" },
  "s5.tests": {
    ar: "{n} اختبارا آليا ناجحا (pytest)، بتاريخ {d}.",
    fr: "{n} tests automatiques réussis (pytest), le {d}.",
    en: "{n} automated tests pass (pytest), run on {d}."
  },
  "s5.tests.none": {
    ar: "لم تُشغَّل الاختبارات عند توليد هذه البيانات.",
    fr: "Les tests n'ont pas été lancés lors de la génération de ces données.",
    en: "Tests were not run when this data was generated."
  },
  "s5.js.ok": {
    ar: "الصيغ في هذه الصفحة تطابق نموذج بايثون ({n} حالة مرجعية).",
    fr: "Les formules de cette page correspondent au modèle Python ({n} cas de référence).",
    en: "The formulas on this page match the Python model ({n} reference cases)."
  },
  "s5.js.fail": {
    ar: "تحذير: {n} من أصل {m} حالة مرجعية لا تطابق نموذج بايثون.",
    fr: "Attention : {n} cas de référence sur {m} ne correspondent pas au modèle Python.",
    en: "Warning: {n} of {m} reference cases do not match the Python model."
  },
  "s5.shows.title": { ar: "ما يُظهره هذا", fr: "Ce que cela montre", en: "What this shows" },
  "s5.shows.1": {
    ar: "كلفة الإيصال المستنتجة صغيرة وموجبة للنوعين ({a} و{b})، وهذا متوقع لأن السعر الدولي يشمل الشحن والتأمين.",
    fr: "Les frais d'approche déduits sont petits et positifs pour les deux carburants ({a} et {b}), comme attendu puisque le CIF inclut fret et assurance.",
    en: "Implied approach costs are small and positive for both fuels ({a} and {b}), as expected since the CIF already includes freight and insurance."
  },
  "s5.shows.2": {
    ar: "حصص الضرائب المستنتجة ({a} و{b}) تطابق ما نشره المجلس، وهذا يدعم مبالغ الضريبة الداخلية وتطبيق الضريبة على القيمة المضافة على الكل.",
    fr: "Les parts de taxes déduites ({a} et {b}) correspondent à celles du Conseil, ce qui conforte les montants de TIC et la TVA sur l'ensemble.",
    en: "Implied tax shares ({a} and {b}) match the Council's, which supports the TIC amounts and VAT on everything."
  },
  "s5.shows.3": {
    ar: "هامش المحطة المستنتج ({a} و{b}) معقول لتجارة التقسيط.",
    fr: "Les marges de station déduites ({a} et {b}) sont plausibles pour le commerce de détail.",
    en: "Implied station margins ({a} and {b}) are plausible for retail."
  },
  "s5.not.title": { ar: "ما لا يُثبته", fr: "Ce que cela ne prouve pas", en: "What it does not prove" },
  "s5.not.1": {
    ar: "أن السعر الدولي في تقرير المجلس هو ما دفعته الشركات فعلا: المجلس نفسه يصفه بأنه إرشادي ونظري.",
    fr: "Que le CIF du rapport soit ce que les distributeurs ont réellement payé : le Conseil le dit lui-même indicatif et théorique.",
    en: "That the CIF in the report is what distributors actually paid: the Council itself calls it indicative and theoretical."
  },
  "s5.not.2": {
    ar: "أن النموذج يصح لكل الفصول: يجب تكرار الاختبار على كل التقارير (المهمة 1.4).",
    fr: "Que le modèle tienne pour tous les trimestres : il faut répéter le test sur chaque rapport (tâche 1.4).",
    en: "That the model holds for every quarter: the check must be repeated on every report (task 1.4)."
  },
  "s5.not.3": {
    ar: "أي شيء عن شركة بعينها: هذه متوسطات لتسع شركات.",
    fr: "Quoi que ce soit sur une entreprise en particulier : ce sont des moyennes sur neuf distributeurs.",
    en: "Anything about a particular company: these are averages across nine distributors."
  },

  /* Section 6: method */
  "s6.title": { ar: "المنهجية خطوة بخطوة", fr: "La méthode, étape par étape", en: "The method, step by step" },
  "s6.lede": {
    ar: "النظرية أولا، ثم التحقق على أرقام معروفة، ثم البيانات، ثم النماذج، ثم المنتوج. لا نقفز على أي مرحلة.",
    fr: "D'abord la théorie, puis la validation sur des chiffres connus, puis les données, les modèles, et enfin le produit. Aucune étape n'est sautée.",
    en: "Theory first, then validation on known numbers, then data, then models, then the product. No step is skipped."
  },
  "s6.p1.title": { ar: "كل رقم بمصدر وتاريخ", fr: "Chaque chiffre a une source et une date", en: "Every number has a source and a date" },
  "s6.p1.body": {
    ar: "الثوابت (الضرائب، الكثافة) محفوظة في مكان واحد مع رابط المصدر وتاريخه ودرجة التحقق منه.",
    fr: "Les constantes (taxes, densités) sont rangées à un seul endroit, avec lien, date et statut de vérification.",
    en: "Constants (taxes, densities) live in one place with a source link, a date and a verification status."
  },
  "s6.p2.title": { ar: "التقدير ليس حقيقة محاسبية", fr: "Une estimation n'est pas un fait comptable", en: "An estimate is not an accounting fact" },
  "s6.p2.body": {
    ar: "كلفة الشراء الحقيقية غير منشورة. كل ما نحسبه «مستنتج من النموذج» ويُنشر مع هامش عدم اليقين.",
    fr: "Les vrais coûts d'achat ne sont pas publics. Tout ce que nous calculons est « déduit du modèle » et publié avec sa marge d'incertitude.",
    en: "True purchase costs are not public. Everything we compute is model-implied and published with its uncertainty range."
  },
  "s6.p3.title": { ar: "مفتوح للنقد", fr: "Ouvert à la critique", en: "Open to challenge" },
  "s6.p3.body": {
    ar: "الكود والمنهجية مفتوحان حتى يتمكن أي شخص من التحقق منهما والاعتراض عليهما.",
    fr: "Le code et la méthode sont ouverts pour que chacun puisse les vérifier et les contester.",
    en: "Code and methods are open so anyone can check and challenge them."
  },
  "s6.ladder.title": { ar: "سلّم النماذج", fr: "L'échelle des modèles", en: "The model ladder" },
  "s6.ladder.lede": {
    ar: "من الأبسط إلى الأغنى. نتوقف حين لا يغيّر النموذج التالي الاستنتاجات.",
    fr: "Du plus simple au plus riche. On s'arrête quand le modèle suivant ne change plus les conclusions.",
    en: "From simplest to richest. We stop climbing when the next model does not change the conclusions."
  },
  "s6.planned": { ar: "مبرمج للمرحلة 3", fr: "Prévu en phase 3", en: "Planned for phase 3" },
  "s6.hyp.title": { ar: "فرضيات مسجلة مسبقا (مسودة)", fr: "Hypothèses pré-enregistrées (brouillon)", en: "Pre-registered hypotheses (draft)" },
  "s6.hyp.lede": {
    ar: "نكتب الفرضيات قبل رؤية النتائج، حتى لا نختار بعد ذلك ما يناسبنا.",
    fr: "Nous écrivons les hypothèses avant de voir les résultats, pour ne pas choisir après coup ce qui nous arrange.",
    en: "We write the hypotheses down before seeing the results, so we cannot pick what suits us afterwards."
  },

  /* Section 7: roadmap */
  "s7.title": { ar: "خارطة الطريق", fr: "Feuille de route", en: "Roadmap" },
  "s7.lede": {
    ar: "لكل مرحلة مُخرَج واختبار يجب اجتيازه قبل المرور إلى ما بعدها.",
    fr: "Chaque phase a un livrable et un test de sortie à réussir avant de passer à la suite.",
    en: "Each phase has a deliverable and an exit test to pass before moving on."
  },
  "s7.phase": { ar: "المرحلة {x}", fr: "Phase {x}", en: "Phase {x}" },
  "s7.status.done": { ar: "منجزة", fr: "terminée", en: "done" },
  "s7.status.active": { ar: "جارية", fr: "en cours", en: "in progress" },
  "s7.status.planned": { ar: "مبرمجة", fr: "prévue", en: "planned" },
  "s7.exit": { ar: "اختبار الخروج", fr: "Test de sortie", en: "Exit test" },
  "s7.tasks.title": { ar: "مهام المرحلة 1", fr: "Tâches de la phase 1", en: "Phase 1 tasks" },
  "s7.todo": { ar: "للإنجاز", fr: "à faire", en: "to do" },
  "s7.risks.title": { ar: "المخاطر وكيف نتعامل معها", fr: "Risques et parades", en: "Risks and how we handle them" },
  "s7.risk": { ar: "الخطر", fr: "Risque", en: "Risk" },
  "s7.mitigation": { ar: "ما نفعله", fr: "Parade", en: "What we do" },
  "s7.decisions.title": { ar: "قرارات مفتوحة", fr: "Décisions ouvertes", en: "Open decisions" },
  "s7.decided": { ar: "محسوم لهذا الموقع", fr: "Tranché pour ce site", en: "Settled for this site" },
  "s7.open": { ar: "مفتوح", fr: "ouvert", en: "open" },

  /* Section 8: sources */
  "s8.title": { ar: "المصادر والبيانات", fr: "Sources et données", en: "Sources and data" },
  "s8.lede": {
    ar: "كل معلومة تحمل درجة تحقق. لا نرفع الدرجة دون فتح المصدر الأصلي.",
    fr: "Chaque fait porte un statut de vérification. On ne le relève jamais sans ouvrir la source primaire.",
    en: "Every fact carries a verification status. We never upgrade it without opening the primary source."
  },
  "s8.constants.title": { ar: "الثوابت المستعملة في النموذج", fr: "Constantes utilisées par le modèle", en: "Constants used by the model" },
  "s8.col.name": { ar: "الثابت", fr: "Constante", en: "Constant" },
  "s8.col.status": { ar: "الحالة", fr: "Statut", en: "Status" },
  "s8.col.asof": { ar: "التاريخ", fr: "Date", en: "As of" },
  "const.vat_rate": { ar: "نسبة الضريبة على القيمة المضافة", fr: "Taux de TVA", en: "VAT rate" },
  "const.tic_gasoil": { ar: "الضريبة الداخلية على الاستهلاك، الغازوال", fr: "TIC, gasoil", en: "TIC, diesel" },
  "const.tic_ssp": { ar: "الضريبة الداخلية على الاستهلاك، البنزين", fr: "TIC, super sans plomb", en: "TIC, gasoline" },
  "const.density_gasoil": { ar: "كثافة الغازوال", fr: "Densité du gasoil", en: "Diesel density" },
  "const.density_ssp": { ar: "كثافة البنزين", fr: "Densité du super", en: "Gasoline density" },
  "s8.list.title": { ar: "قائمة المصادر", fr: "Liste des sources", en: "Source list" },
  "s8.filter.label": { ar: "تصفية حسب الحالة", fr: "Filtrer par statut", en: "Filter by status" },
  "s8.filter.all": { ar: "الكل", fr: "Toutes", en: "All" },
  "s8.search": { ar: "ابحث في المصادر", fr: "Rechercher dans les sources", en: "Search sources" },
  "s8.count": { ar: "عدد المصادر المعروضة: {x}", fr: "Sources affichées : {x}", en: "Sources shown: {x}" },
  "s8.none": { ar: "لا توجد مصادر مطابقة.", fr: "Aucune source ne correspond.", en: "No matching sources." },
  "s8.nolink": { ar: "بدون رابط", fr: "sans lien", en: "no link" },
  "cat.cc": { ar: "مجلس المنافسة", fr: "Conseil de la concurrence", en: "Competition Council" },
  "cat.official": { ar: "مصادر رسمية أخرى", fr: "Autres sources officielles", en: "Other official sources" },
  "cat.tax": { ar: "الضرائب وتركيبة الثمن", fr: "Fiscalité et structure du prix", en: "Taxes and price structure" },
  "cat.market": { ar: "السوق والأحداث", fr: "Marché et actualité", en: "Market and events" },
  "cat.proxy": { ar: "أسعار دولية مجانية", fr: "Prix internationaux gratuits", en: "Free world price proxies" },
  "cat.prior": { ar: "مشاريع سابقة في المغرب", fr: "Projets antérieurs au Maroc", en: "Earlier projects in Morocco" },
  "cat.academic": { ar: "دراسات أكاديمية", fr: "Recherche académique", en: "Academic research" },
  "s8.glossary.title": { ar: "المعجم", fr: "Glossaire", en: "Glossary" },
  "s8.glossary.note": {
    ar: "المصطلحات العربية بحاجة إلى مراجعة من متحدث أصلي قبل اعتمادها نهائيا.",
    fr: "Les termes arabes doivent être relus par un locuteur natif avant usage définitif.",
    en: "Arabic terms need review by a native speaker before final use."
  },

  /* Footer */
  "foot.disclaimer": {
    ar: "«مازوطي» مشروع بحثي. الهوامش والفوارق المعروضة تقديرات مستنتجة من نموذج، وليست أرقاما محاسبية ولا اتهاما لأي شركة.",
    fr: "mazoti.ma est un projet de recherche. Les marges et écarts affichés sont des estimations déduites d'un modèle, ni des chiffres comptables ni une accusation envers une entreprise.",
    en: "mazoti.ma is a research project. Margins and gaps shown are model-implied estimates, not accounting figures and not a claim about any company."
  },
  "foot.build": {
    ar: "البيانات مولّدة بتاريخ {d} · نسخة النموذج {v}",
    fr: "Données générées le {d} · modèle v{v}",
    en: "Data generated on {d} · model v{v}"
  },
  "foot.translation": {
    ar: "النصوص العربية والفرنسية في انتظار مراجعة لغوية من متحدثين أصليين.",
    fr: "Les textes arabe et français attendent une relecture par des locuteurs natifs.",
    en: "Arabic and French text is awaiting review by native speakers."
  },
  "foot.licence": { ar: "الترخيص لم يُحدَّد بعد.", fr: "Licence pas encore choisie.", en: "Licence not chosen yet." }
};
