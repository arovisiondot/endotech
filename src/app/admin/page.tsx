"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  Save,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Layout,
  Image as ImageIcon,
  Package,
  Layers,
  Settings,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  Globe2,
  Factory,
  Cog,
  Truck,
  X,
  Crosshair,
  Building2,
  Video as VideoIcon,
  Play,
  Mail,
  Bell,
  FileText,
  Grid,
  PlusCircle,
  Check,
  Leaf,
  Sun,
  Recycle,
  Droplets,
  Download,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { useContent, ProductItem, SiteContent } from "@/context/ContentContext";
import AboutSection from "@/components/AboutSection";
import InteractiveHeroCard from "@/components/InteractiveHeroCard";
import ProductCategoriesSection from "@/components/ProductCategoriesSection";
import { uploadFileFast } from "@/lib/imageUpload";

const DEFAULT_ADMIN_PRODUCT_CATEGORIES = [
  {
    id: "cat-gen",
    name: "General Instrumentation",
    slug: "general-instrumentation",
    subcategories: [
      "Scalpels",
      "Scissors",
      "Forceps",
      "Artery Forceps",
      "Cotton Swab Forceps",
      "Retractors",
      "Probes, Applicators, Spatulas",
      "Diagnostics",
      "Trocars, Suction Tubes, Cannulas",
      "Anaesthesia",
      "Suture",
      "Dressings",
      "Bone Surgery",
      "Cardiovascular / Neuro",
      "Neurosurgery",
      "Tracheotomy",
      "Dermatology",
      "Stomach, Intestines, Rectum",
      "Urology",
      "Gynaecology",
      "Obstetrics",
      "Calipers",
      "Otology",
      "Rhinology",
      "Tonsillectomy, Laryngo-Bronchoscopy",
      "Hygiene, Storage",
      "Oral Maxillo-Facial Surgery",
      "Cranio-Maxillo-Facial Surgery",
      "Asepsis",
      "Needle Holders",
      "Extracting Forceps",
      "Dental Elevators",
      "Dental And Oral Surgery"
    ],
  },
  {
    id: "cat-dental",
    name: "Dental Instruments",
    slug: "dental-instruments",
    subcategories: [
      "Dental Elevators",
      "Extracting Forceps",
      "Scaling Instruments",
      "Filling Instruments",
      "Orthodontic Pliers",
      "Mouth Mirrors & Handles",
      "Periodontal Probes",
      "Root Tip Picks"
    ],
  },
  {
    id: "cat-ent",
    name: "ENT Instruments",
    slug: "ent-instruments",
    subcategories: [
      "Laryngeal Cup Forceps",
      "Nose Speculums",
      "Ear Curettes",
      "Otology Forceps",
      "Tuning Forks",
      "Nasal Snares"
    ],
  },
  {
    id: "cat-ortho",
    name: "Orthopedic Instruments",
    slug: "orthopedic-instruments",
    subcategories: [
      "Kerrison Rongeurs",
      "Bone Punches",
      "Bone Holding Forceps",
      "Bone Chisels & Gouges",
      "Wire Cutters & Pliers",
      "Mallets & Tampers",
      "Plate Benders"
    ],
  },
];

const DEFAULT_ABOUT_CONTENT = {
  bannerHeadline: "OVER 35 YEARS OF MANUFACTURING EXCELLENCE",
  bannerTitleLine1: "CARE WITH TRUST IN SURGERY.",
  bannerTitleHighlight: "EVERY INSTRUMENT, EVERY CUT.",
  bannerImage: "/images/global-standards/compliances-surgeon-hands.png",
  missionSubtitle: "OUR MISSION & GLOBAL HERITAGE",
  missionTitle: "Care with Trust... Dedicated to Surgical Precision.",
  missionText1:
    "Founded in Sialkot, Pakistan – the world's historic hub for surgical instrument manufacturing – Endo Tech Group of Industries has grown into an international powerhouse supplying hospital networks, healthcare authorities, and premium distributor brands across 65+ nations.",
  missionText2:
    "We operate under comprehensive Quality Management Systems conforming to ISO 9001:2015, ISO 13485:2016, European CE Medical Device Regulations (MDR), and US FDA Good Manufacturing Practices (cGMP).",
  buttonText: "Explore Product Range",
  buttonLink: "/products",
  stats: [
    { value: 250, suffix: "+", label: "Skilled Toolmakers", description: "Master metallurgical craftsmen" },
    { value: 10000, suffix: "+", label: "Instruments Portfolio", description: "From standard scalpel to micro-neuro" },
    { value: 65, suffix: "+", label: "Export Destinations", description: "Supplying premier hospitals worldwide" },
    { value: 35, suffix: "+", label: "Years Experience", description: "Continuous surgical innovation" },
  ],
  accreditations: [
    {
      title: "ISO 13485:2016 Certified",
      desc: "Medical Devices Quality Management System certification for international export.",
    },
    {
      title: "CE Marking (EU MDR)",
      desc: "Class I and Class IIa surgical conformity marking for the European Union.",
    },
    {
      title: "US FDA Registered (cGMP)",
      desc: "Listed medical device establishment compliance with US FDA regulations.",
    },
    {
      title: "Sialkot Chamber of Commerce",
      desc: "Member in good standing with the Surgical Instruments Manufacturers Association of Pakistan (SIMAP).",
    },
  ],
};

const DEFAULT_RESOURCES_CONTENT = {
  bannerHeadline: "TECHNICAL DOCUMENTATION & LITERATURE",
  bannerTitleLine1: "OFFICIAL PRODUCT CATALOGUES.",
  bannerTitleHighlight: "DOWNLOAD SPECIFICATIONS.",
  bannerImage: "/images/global-standards/compliances-surgeon-hands.png",
  subtitle:
    "Access our official high-resolution PDF catalogues featuring over 10,000 surgical, dental, ENT, and orthopedic instruments with full technical dimensions and article codes.",
  catalogs: [
    {
      id: "cat-1",
      title: "General Surgery Complete Catalogue",
      category_name: "General Surgery",
      description: "Comprehensive guide to scalpels, forceps, scissors, retractors, needle holders, and general surgical instruments.",
      file_url: "/catalogs/general-surgery.pdf",
      file_size: "18.4 MB",
      downloads_count: 3420,
    },
    {
      id: "cat-2",
      title: "Dental & Oral Surgery Catalogue",
      category_name: "Dental Instruments",
      description: "Extracting forceps, dental elevators, scaling instruments, filling tools, and orthodontic pliers.",
      file_url: "/catalogs/dental-instruments.pdf",
      file_size: "14.2 MB",
      downloads_count: 2180,
    },
    {
      id: "cat-3",
      title: "ENT & Laryngeal Instruments Catalogue",
      category_name: "ENT Instruments",
      description: "Micro-laryngeal cup forceps, ear curettes, nasal speculums, and otology instruments.",
      file_url: "/catalogs/ent-instruments.pdf",
      file_size: "11.6 MB",
      downloads_count: 1890,
    },
    {
      id: "cat-4",
      title: "Orthopedics & Spine Catalogue",
      category_name: "Orthopedic Instruments",
      description: "Kerrison rongeurs, bone punches, bone holding forceps, chisels, mallets, and plate benders.",
      file_url: "/catalogs/orthopedics.pdf",
      file_size: "22.1 MB",
      downloads_count: 2740,
    },
  ],
};

const DEFAULT_DEPARTMENTS_CONTENT = {
  bannerHeadline: "FACILITIES, SPECIALTIES & MANUFACTURING EXCELLENCE",
  bannerTitleLine1: "CLINICAL SPECIALTIES &",
  bannerTitleHighlight: "MANUFACTURING DEPARTMENTS.",
  bannerImage: "/images/global-standards/compliances-surgeon-hands.png",
  subtitle:
    "From specialized surgical disciplines to advanced metallurgy and cleanroom passivation, explore how Endo Tech delivers surgical excellence.",
  clinicalSpecialties: [
    {
      id: "spec-1",
      code: "01",
      name: "General Surgery",
      slug: "general-instrumentation",
      description: "High-precision scalpel handles, surgical scissors, tissue forceps, hemostatic clamps, and wound retractors engineered for all surgical disciplines.",
    },
    {
      id: "spec-2",
      code: "02",
      name: "Dental & Oral Maxillofacial",
      slug: "dental-instruments",
      description: "Ergonomic extracting forceps, dental elevators, periosteal instruments, scalers, and micro-pliers conforming to international dental standards.",
    },
    {
      id: "spec-3",
      code: "03",
      name: "ENT (Otolaryngology)",
      slug: "ent-instruments",
      description: "Specialized micro-laryngeal cup forceps, nasal speculums, ear curettes, and sinus endoscopy instruments for delicate head and neck surgery.",
    },
    {
      id: "spec-4",
      code: "04",
      name: "Orthopedics & Spine Surgery",
      slug: "orthopedics",
      description: "High-torque Kerrison rongeurs, bone holding forceps, bone chisels, osteotomes, and plate benders made from high-strength German stainless steel.",
    },
    {
      id: "spec-5",
      code: "05",
      name: "Gynecology & Obstetrics",
      slug: "gynecology",
      description: "Vaginal speculums, uterine dilators, biopsy punches, ovum forceps, and caesarean instruments designed for patient safety and procedural efficiency.",
    },
    {
      id: "spec-6",
      code: "06",
      name: "Cardiovascular & Micro-Surgery",
      slug: "general-instrumentation",
      description: "Micro-needle holders with tungsten carbide inserts, atraumatic vascular clamps, and micro-scissors for high-magnification surgical procedures.",
    },
  ],
  manufacturingDivisions: [
    {
      id: "mfg-1",
      title: "Hot Drop-Forging & Precision Tooling",
      desc: "High-tonnage forging presses creating closed-die blanks from certified medical-grade AISI 420 and German stainless steel.",
      badge: "DIVISION 01",
    },
    {
      id: "mfg-2",
      title: "CNC 5-Axis Milling & Micro-Machining",
      desc: "German computer numerical control machining centers ensuring micron-level accuracy for bone punches, rongeurs, and micro-scissors.",
      badge: "DIVISION 02",
    },
    {
      id: "mfg-3",
      title: "Master Toolmaker Hand-Finishing & Assembly",
      desc: "Generations of master metallurgical craftsmen hand-aligning tips, adjusting spring tensions, and balancing instruments for surgical feel.",
      badge: "DIVISION 03",
    },
    {
      id: "mfg-4",
      title: "Class 10,000 Cleanroom & Ultrasonic Passivation",
      desc: "Multi-stage automated ultrasonic cleaning baths, nitric acid chemical passivation, and sterile barrier packaging conforming to ISO 13485.",
      badge: "DIVISION 04",
    },
  ],
};

const DEFAULT_SUSTAINABILITY_CONTENT = {
  bannerHeadline: "ENVIRONMENTAL RESPONSIBILITY & GREEN MANUFACTURING",
  bannerTitleLine1: "SUSTAINABLE SURGICAL SOLUTIONS.",
  bannerTitleHighlight: "PROTECTING OUR PLANET.",
  bannerImage: "/images/global-standards/compliances-surgeon-hands.png",
  introText:
    "At Endo Tech Group of Industries, we believe that advancing healthcare must not come at the expense of our planet. Our green manufacturing initiatives in Sialkot integrate renewable energy, zero chemical discharge, and circular metallurgical recycling.",
  initiatives: [
    {
      id: "init-1",
      title: "100% Recyclable Medical-Grade Steel",
      desc: "All AISI 420 and German stainless steel offcuts and swarf are 100% segregated and recycled into secondary industrial processes, achieving near-zero metallurgical scrap.",
      icon: "recycle",
    },
    {
      id: "init-2",
      title: "Solar Powered Clean Facility",
      desc: "Our manufacturing campus operates a 250 kW on-site rooftop solar photovoltaic system, reducing carbon emissions by 180 metric tons annually.",
      icon: "sun",
    },
    {
      id: "init-3",
      title: "Zero Liquid Discharge (ZLD) Effluent Plant",
      desc: "All electropolishing, ultrasonic washing, and passivating wastewater undergoes multi-stage chemical and biological treatment, recycling clean water back into processing.",
      icon: "droplets",
    },
    {
      id: "init-4",
      title: "Eco-Friendly Biodegradable Packaging",
      desc: "Non-sterile bulk packaging uses 100% recycled unbleached cardboard and water-soluble protective coatings, eliminating single-use plastics.",
      icon: "leaf",
    },
  ],
  stats: [
    { value: "100", suffix: "%", label: "Recyclable Steel", desc: "Zero metallurgical landfill waste" },
    { value: "45", suffix: "%", label: "Solar Energy Powered", desc: "Clean energy CNC machining" },
    { value: "Zero", suffix: "", label: "Liquid Discharge", desc: "Full closed-loop water treatment" },
    { value: "ISO 14001", suffix: "", label: "Environmental Audit", desc: "Ecological compliance" },
  ],
};

const DEFAULT_CONTACT_CONTENT = {
  bannerHeadline: "DIRECT FACTORY COMMUNICATION & EXPORT INQUIRIES",
  bannerTitleLine1: "CONNECT WITH FACTORY EXPORT TEAM.",
  bannerTitleHighlight: "FAST GLOBAL RESPONSE.",
  bannerImage: "/images/global-standards/compliances-surgeon-hands.png",
  address: "Al Muslim Street #5 Islam Nagar Road, Pacca Garah, Sialkot, Punjab 51310 Pakistan",
  phone: "+92 52 4598114-16 (Ext 102/104)",
  mobile: "+92 300 8614441",
  primaryEmail: "info@endotech.com.pk",
  directEmail: "ghafar@endotech.com.pk",
  workingHours: "Monday – Saturday: 08:30 AM – 06:00 PM (PKT / GMT+5)",
  inquiryNote: "Our commercial managers respond to all wholesale and OEM requests within 12 business hours.",
};

export default function AdminPage() {
  const {
    content,
    products,
    saveContent,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshData,
  } = useContent();

  const [adminProductPage, setAdminProductPage] = useState(1);
  const [adminProductSearch, setAdminProductSearch] = useState("");
  const ADMIN_PRODUCTS_PER_PAGE = 50;

  const [activeTab, setActiveTabState] = useState<
    | "hero"
    | "about"
    | "categories"
    | "what-we-do"
    | "video"
    | "solutions"
    | "standards"
    | "products"
    | "product-page"
    | "sections"
    | "contact"
    | "preview"
    | "page-about"
    | "page-departments"
    | "page-resources"
    | "page-sustainability"
    | "page-contact"
  >("hero");

  // Read saved tab on mount so page refreshes never shuffle the user back to hero
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("endotech_admin_tab") as any;
      if (
        savedTab &&
        [
          "hero",
          "about",
          "categories",
          "what-we-do",
          "video",
          "solutions",
          "standards",
          "products",
          "product-page",
          "sections",
          "contact",
          "preview",
          "page-about",
          "page-departments",
          "page-resources",
          "page-sustainability",
          "page-contact",
        ].includes(savedTab)
      ) {
        setActiveTabState(savedTab as any);
      }
    }
  }, []);

  const setActiveTab = (
    tab:
      | "hero"
      | "about"
      | "categories"
      | "what-we-do"
      | "video"
      | "solutions"
      | "standards"
      | "products"
      | "product-page"
      | "sections"
      | "contact"
      | "preview"
      | "page-about"
      | "page-departments"
      | "page-resources"
      | "page-sustainability"
      | "page-contact"
  ) => {
    setActiveTabState(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("endotech_admin_tab", tab);
    }
  };

  // Local draft state for site content
  const [formData, setFormData] = useState<SiteContent>(content);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingAbout, setIsUploadingAbout] = useState(false);
  const [uploadingCategoryCardId, setUploadingCategoryCardId] = useState<string | null>(null);
  const [isUploadingWhatWeDo, setIsUploadingWhatWeDo] = useState(false);
  const [uploadingWhatWeDoCardId, setUploadingWhatWeDoCardId] = useState<string | null>(null);
  const [isUploadingVideoFile, setIsUploadingVideoFile] = useState(false);
  const [isUploadingVideoBanner, setIsUploadingVideoBanner] = useState(false);
  const [isUploadingSolutionsBanner, setIsUploadingSolutionsBanner] = useState(false);
  const [uploadingSolutionsCardId, setUploadingSolutionsCardId] = useState<string | null>(null);
  const [isUploadingCatalogCardId, setIsUploadingCatalogCardId] = useState<string | null>(null);
  const [isUploadingProductPageBanner, setIsUploadingProductPageBanner] = useState(false);
  const [selectedAdminCatIdx, setSelectedAdminCatIdx] = useState(0);
  const [newCatNameInput, setNewCatNameInput] = useState("");
  const [newSubcatInput, setNewSubcatInput] = useState("");

  const handleCardCatalogUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    cardId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCatalogCardId(cardId);
    try {
      const uploadedPath = await uploadFileFast(file);
      if (uploadedPath) {
        setFormData((prev: any) => ({
          ...prev,
          advancedSolutionsSection: {
            ...(prev as any).advancedSolutionsSection,
            capabilitiesCards: (
              (prev as any).advancedSolutionsSection?.capabilitiesCards || []
            ).map((c: any) =>
              c.id === cardId
                ? {
                  ...c,
                  linkUrl: uploadedPath,
                  catalogFileName: file.name,
                }
                : c
            ),
          },
        }));
      } else {
        alert("File uploaded but no URL was returned.");
      }
    } catch (err) {
      console.error("Catalog upload error:", err);
      alert("Error occurred during catalog upload.");
    } finally {
      setIsUploadingCatalogCardId(null);
      e.target.value = "";
    }
  };

  // Product Page & Mega Menu Handlers
  const handleProductPageBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProductPageBanner(true);
    try {
      const url = await uploadFileFast(file);
      if (url) {
        setFormData((prev: any) => ({
          ...prev,
          productPage: {
            ...((prev as any).productPage || {}),
            bannerImage: url,
          },
        }));
      }
    } catch (err) {
      console.error("Banner upload error:", err);
      alert("Banner image upload failed.");
    } finally {
      setIsUploadingProductPageBanner(false);
      e.target.value = "";
    }
  };

  const getBaseCategories = useCallback((currentData: any) => {
    const c = currentData?.productPage?.categories;
    if (Array.isArray(c) && c.length > 0) return c;
    const fromContent = (content as any)?.productPage?.categories;
    if (Array.isArray(fromContent) && fromContent.length > 0) return fromContent;
    return DEFAULT_ADMIN_PRODUCT_CATEGORIES;
  }, [content]);

  const saveCategoriesImmediately = async (newCats: any[]) => {
    const updated = {
      ...formData,
      productPage: {
        ...((formData as any)?.productPage || {}),
        categories: newCats,
      },
    };
    setFormData(updated);
    try {
      await saveContent(updated as any);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error("Auto-save categories failed", err);
    }
  };

  const handleUpdateCategoryName = (catIdx: number, newName: string) => {
    const cats = [...getBaseCategories(formData)];
    if (cats[catIdx]) {
      cats[catIdx] = { ...cats[catIdx], name: newName };
      saveCategoriesImmediately(cats);
    }
  };

  const handleAddNewCategory = () => {
    if (!newCatNameInput.trim()) return;
    const name = newCatNameInput.trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const cats = [...getBaseCategories(formData)];
    cats.push({
      id: `cat-${Date.now()}`,
      name,
      slug,
      subcategories: [],
    });
    setNewCatNameInput("");
    setSelectedAdminCatIdx(cats.length - 1);
    saveCategoriesImmediately(cats);
  };

  const handleDeleteProductPageCategory = (catIdx: number) => {
    const cats = [...getBaseCategories(formData)];
    const catName = cats[catIdx]?.name || "this category";
    if (!confirm(`Are you sure you want to permanently delete "${catName}" and all its sub-categories?`)) return;
    cats.splice(catIdx, 1);
    if (selectedAdminCatIdx >= cats.length && cats.length > 0) {
      setSelectedAdminCatIdx(cats.length - 1);
    }
    saveCategoriesImmediately(cats);
  };

  const handleMoveCategoryUp = (catIdx: number) => {
    if (catIdx <= 0) return;
    const cats = [...getBaseCategories(formData)];
    const temp = cats[catIdx - 1];
    cats[catIdx - 1] = cats[catIdx];
    cats[catIdx] = temp;
    setSelectedAdminCatIdx(catIdx - 1);
    saveCategoriesImmediately(cats);
  };

  const handleMoveCategoryDown = (catIdx: number) => {
    const cats = [...getBaseCategories(formData)];
    if (catIdx >= cats.length - 1) return;
    const temp = cats[catIdx + 1];
    cats[catIdx + 1] = cats[catIdx];
    cats[catIdx] = temp;
    setSelectedAdminCatIdx(catIdx + 1);
    saveCategoriesImmediately(cats);
  };

  const handleAddSubcategory = (catIdx: number) => {
    if (!newSubcatInput.trim()) return;
    const cats = [...getBaseCategories(formData)];
    if (cats[catIdx]) {
      const subs = [...(cats[catIdx].subcategories || [])];
      subs.push(newSubcatInput.trim());
      cats[catIdx] = { ...cats[catIdx], subcategories: subs };
      setNewSubcatInput("");
      saveCategoriesImmediately(cats);
    }
  };

  const handleRemoveSubcategory = (catIdx: number, subIdx: number) => {
    const cats = [...getBaseCategories(formData)];
    if (cats[catIdx] && cats[catIdx].subcategories) {
      const subName = cats[catIdx].subcategories[subIdx];
      if (!confirm(`Are you sure you want to remove sub-category "${subName}"?`)) return;
      const subs = [...cats[catIdx].subcategories];
      subs.splice(subIdx, 1);
      cats[catIdx] = { ...cats[catIdx], subcategories: subs };
      saveCategoriesImmediately(cats);
    }
  };

  const handleUpdateSubcategoryName = (catIdx: number, subIdx: number, newName: string) => {
    const cats = [...getBaseCategories(formData)];
    if (cats[catIdx] && cats[catIdx].subcategories) {
      const subs = [...cats[catIdx].subcategories];
      subs[subIdx] = newName;
      cats[catIdx] = { ...cats[catIdx], subcategories: subs };
      saveCategoriesImmediately(cats);
    }
  };

  const handleMoveSubcategoryUp = (catIdx: number, subIdx: number) => {
    if (subIdx <= 0) return;
    const cats = [...getBaseCategories(formData)];
    if (cats[catIdx] && cats[catIdx].subcategories) {
      const subs = [...cats[catIdx].subcategories];
      const temp = subs[subIdx - 1];
      subs[subIdx - 1] = subs[subIdx];
      subs[subIdx] = temp;
      cats[catIdx] = { ...cats[catIdx], subcategories: subs };
      saveCategoriesImmediately(cats);
    }
  };

  const handleMoveSubcategoryDown = (catIdx: number, subIdx: number) => {
    const cats = [...getBaseCategories(formData)];
    if (cats[catIdx] && cats[catIdx].subcategories && subIdx < cats[catIdx].subcategories.length - 1) {
      const subs = [...cats[catIdx].subcategories];
      const temp = subs[subIdx + 1];
      subs[subIdx + 1] = subs[subIdx];
      subs[subIdx] = temp;
      cats[catIdx] = { ...cats[catIdx], subcategories: subs };
      saveCategoriesImmediately(cats);
    }
  };
  const [isUploadingCompImage, setIsUploadingCompImage] = useState(false);
  const [isUploadingToolsImage, setIsUploadingToolsImage] = useState(false);
  const [isUploadingGlobeImage, setIsUploadingGlobeImage] = useState(false);

  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [sizeOptionsText, setSizeOptionsText] = useState("");
  const [customSpecsList, setCustomSpecsList] = useState<{ label: string; value: string }[]>([]);
  const [sizesTableList, setSizesTableList] = useState<
    { article_number: string; pattern?: string; cup_size?: string; length?: string }[]
  >([]);
  const [productForm, setProductForm] = useState<Partial<ProductItem>>({
    code: "",
    name: "",
    category: "general-instrumentation",
    subcategory: "",
    description: "",
    image: "",
    gallery: [],
    isFeatured: true,
    material: "",
    stock: "In Stock",
  });
  const [productSaving, setProductSaving] = useState(false);
  const [homeSectionsOpen, setHomeSectionsOpen] = useState(true);
  const [productsSectionOpen, setProductsSectionOpen] = useState(true);
  const [otherPagesOpen, setOtherPagesOpen] = useState(true);

  const [isUploadingAboutBanner, setIsUploadingAboutBanner] = useState(false);
  const [isUploadingDepartmentsBanner, setIsUploadingDepartmentsBanner] = useState(false);
  const [isUploadingResourcesBanner, setIsUploadingResourcesBanner] = useState(false);
  const [isUploadingSustainabilityBanner, setIsUploadingSustainabilityBanner] = useState(false);
  const [isUploadingContactBanner, setIsUploadingContactBanner] = useState(false);

  const handleAboutBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAboutBanner(true);
    try {
      const url = await uploadFileFast(file);
      if (url) {
        setFormData((prev: any) => ({
          ...prev,
          aboutPage: { ...DEFAULT_ABOUT_CONTENT, ...((prev as any).aboutPage || {}), bannerImage: url },
        }));
      }
    } finally {
      setIsUploadingAboutBanner(false);
      e.target.value = "";
    }
  };

  const handleDepartmentsBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingDepartmentsBanner(true);
    try {
      const url = await uploadFileFast(file);
      if (url) {
        setFormData((prev: any) => ({
          ...prev,
          departmentsPage: { ...DEFAULT_DEPARTMENTS_CONTENT, ...((prev as any).departmentsPage || {}), bannerImage: url },
        }));
      }
    } finally {
      setIsUploadingDepartmentsBanner(false);
      e.target.value = "";
    }
  };

  const handleResourcesBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingResourcesBanner(true);
    try {
      const url = await uploadFileFast(file);
      if (url) {
        setFormData((prev: any) => ({
          ...prev,
          resourcesPage: { ...DEFAULT_RESOURCES_CONTENT, ...((prev as any).resourcesPage || {}), bannerImage: url },
        }));
      }
    } finally {
      setIsUploadingResourcesBanner(false);
      e.target.value = "";
    }
  };

  const handleSustainabilityBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingSustainabilityBanner(true);
    try {
      const url = await uploadFileFast(file);
      if (url) {
        setFormData((prev: any) => ({
          ...prev,
          sustainabilityPage: { ...DEFAULT_SUSTAINABILITY_CONTENT, ...((prev as any).sustainabilityPage || {}), bannerImage: url },
        }));
      }
    } finally {
      setIsUploadingSustainabilityBanner(false);
      e.target.value = "";
    }
  };

  const handleContactBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingContactBanner(true);
    try {
      const url = await uploadFileFast(file);
      if (url) {
        setFormData((prev: any) => ({
          ...prev,
          contactPage: { ...DEFAULT_CONTACT_CONTENT, ...((prev as any).contactPage || {}), bannerImage: url },
        }));
      }
    } finally {
      setIsUploadingContactBanner(false);
      e.target.value = "";
    }
  };

  const handleResourcesCatalogPdfUpload = async (
    catIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadFileFast(file);
      if (url) {
        setFormData((prev: any) => {
          const catalogs = [...(prev.resourcesPage?.catalogs || [])];
          if (catalogs[catIndex]) {
            catalogs[catIndex] = { ...catalogs[catIndex], file_url: url };
          }
          return {
            ...prev,
            resourcesPage: { ...(prev.resourcesPage || {}), catalogs },
          };
        });
      }
    } finally {
      e.target.value = "";
    }
  };

  const handleAddSizePreset = (sizeLabel: string) => {
    setSizeOptionsText((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return sizeLabel;
      const parts = trimmed.split(",").map((s) => s.trim()).filter(Boolean);
      if (!parts.includes(sizeLabel)) {
        parts.push(sizeLabel);
      }
      return parts.join(", ");
    });

    // Also directly append a size table row so it is immediately visible in the Available Sizes Table
    setSizesTableList((prev) => {
      const isMm = sizeLabel.toLowerCase().includes("mm");
      const isCm = sizeLabel.toLowerCase().includes("cm");
      const nextNum = prev.length + 1;
      const baseCode = productForm.code?.trim() || "ET";
      const newRow = {
        article_number: `${baseCode}-${nextNum}`,
        pattern: productForm.pattern?.trim() || "Fine Straight",
        cup_size: isMm ? sizeLabel : "Standard",
        length: isCm ? sizeLabel : (productForm.length?.trim() || "11.5 cm"),
      };
      return [...prev, newRow];
    });
  };

  // Initialize formData on initial load and sync categories & pages if missing
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (content) {
      if (!hasInitialized.current) {
        let initial: any = {
          ...content,
          aboutPage: { ...DEFAULT_ABOUT_CONTENT, ...((content as any).aboutPage || {}) },
          resourcesPage: { ...DEFAULT_RESOURCES_CONTENT, ...((content as any).resourcesPage || {}) },
          departmentsPage: { ...DEFAULT_DEPARTMENTS_CONTENT, ...((content as any).departmentsPage || {}) },
          sustainabilityPage: { ...DEFAULT_SUSTAINABILITY_CONTENT, ...((content as any).sustainabilityPage || {}) },
          contactPage: { ...DEFAULT_CONTACT_CONTENT, ...((content as any).contactPage || {}) },
        };
        if (!initial?.productPage?.categories?.length) {
          initial = {
            ...initial,
            productPage: {
              ...(initial.productPage || {}),
              categories: DEFAULT_ADMIN_PRODUCT_CATEGORIES,
            },
          };
        }
        setFormData(initial);
        hasInitialized.current = true;
      } else {
        // If content gained categoriesSection or whatWeDoSection and formData doesn't have it yet, sync it
        setFormData((prev: any) => {
          let updated = prev;
          if (!prev?.categoriesSection?.categories?.length && (content as any)?.categoriesSection?.categories?.length) {
            updated = {
              ...updated,
              categoriesSection: (content as any).categoriesSection,
            };
          }
          if (!prev?.whatWeDoSection?.cards?.length && (content as any)?.whatWeDoSection?.cards?.length) {
            updated = {
              ...updated,
              whatWeDoSection: (content as any).whatWeDoSection,
            };
          }
          if (!prev?.advancedSolutionsSection?.capabilitiesCards?.length && (content as any)?.advancedSolutionsSection?.capabilitiesCards?.length) {
            updated = {
              ...updated,
              advancedSolutionsSection: (content as any).advancedSolutionsSection,
            };
          }
          if (!updated?.productPage?.categories?.length) {
            updated = {
              ...updated,
              productPage: {
                ...((updated as any).productPage || {}),
                categories: (content as any)?.productPage?.categories?.length
                  ? (content as any).productPage.categories
                  : DEFAULT_ADMIN_PRODUCT_CATEGORIES,
              },
            };
          }
          if (!updated?.aboutPage?.bannerHeadline) {
            updated = { ...updated, aboutPage: { ...DEFAULT_ABOUT_CONTENT, ...(updated.aboutPage || {}) } };
          }
          if (!updated?.resourcesPage?.bannerHeadline) {
            updated = { ...updated, resourcesPage: { ...DEFAULT_RESOURCES_CONTENT, ...(updated.resourcesPage || {}) } };
          }
          if (!updated?.departmentsPage?.bannerHeadline) {
            updated = { ...updated, departmentsPage: { ...DEFAULT_DEPARTMENTS_CONTENT, ...(updated.departmentsPage || {}) } };
          }
          if (!updated?.sustainabilityPage?.bannerHeadline) {
            updated = { ...updated, sustainabilityPage: { ...DEFAULT_SUSTAINABILITY_CONTENT, ...(updated.sustainabilityPage || {}) } };
          }
          if (!updated?.contactPage?.bannerHeadline) {
            updated = { ...updated, contactPage: { ...DEFAULT_CONTACT_CONTENT, ...(updated.contactPage || {}) } };
          }
          return updated;
        });
      }
    }
  }, [content]);

  // Handle image file upload
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetField: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (targetField === "hero.bannerImage") {
      setIsUploadingHero(true);
    } else if (targetField === "aboutSection.image") {
      setIsUploadingAbout(true);
    }

    try {
      const uploadedUrl = await uploadFileFast(file);
      if (uploadedUrl) {
        if (targetField === "hero.bannerImage") {
          setFormData((prev) => ({
            ...prev,
            hero: { ...prev.hero, bannerImage: uploadedUrl },
          }));
        } else if (targetField === "aboutSection.image") {
          setFormData((prev) => ({
            ...prev,
            aboutSection: { ...prev.aboutSection, image: uploadedUrl },
          }));
        } else if (targetField.startsWith("aboutSection.feature.")) {
          const featId = targetField.replace("aboutSection.feature.", "");
          setFormData((prev) => ({
            ...prev,
            aboutSection: {
              ...prev.aboutSection,
              features: (prev.aboutSection.features || []).map((f: any) =>
                f.id === featId ? { ...f, image: uploadedUrl } : f
              ),
            },
          }));
        } else if (targetField.startsWith("aboutSection.certification.")) {
          const certId = targetField.replace("aboutSection.certification.", "");
          setFormData((prev) => ({
            ...prev,
            aboutSection: {
              ...prev.aboutSection,
              certifications: (prev.aboutSection.certifications || []).map((c: any) =>
                c.id === certId ? { ...c, image: uploadedUrl } : c
              ),
            },
          }));
        } else if (targetField === "precisionSection.image") {
          setFormData((prev) => ({
            ...prev,
            precisionSection: { ...prev.precisionSection, image: uploadedUrl },
          }));
        } else if (targetField === "videoSection.bannerImage") {
          setFormData((prev) => ({
            ...prev,
            videoSection: { ...prev.videoSection, bannerImage: uploadedUrl },
          }));
        } else if (targetField === "certificationsSection.image") {
          setFormData((prev) => ({
            ...prev,
            certificationsSection: { ...prev.certificationsSection, image: uploadedUrl },
          }));
        } else if (targetField === "globalReachSection.image") {
          setFormData((prev) => ({
            ...prev,
            globalReachSection: { ...prev.globalReachSection, image: uploadedUrl },
          }));
        } else if (targetField === "productForm.image") {
          setProductForm((prev) => ({ ...prev, image: uploadedUrl }));
        } else if (targetField === "productForm.gallery") {
          setProductForm((prev) => ({
            ...prev,
            gallery: [...(prev.gallery || []), uploadedUrl],
          }));
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingHero(false);
      setIsUploadingAbout(false);
    }
  };

  // Save changes to API & persistent server file
  const handleSaveContent = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError("");

    try {
      const success = await saveContent(formData);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setSaveError("Failed to save changes to server. Please try again.");
      }
    } catch {
      setSaveError("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.code) {
      alert("Please provide both Product Name and Code/SKU.");
      return;
    }

    const parsedSizes = sizeOptionsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const filteredSpecs = customSpecsList.filter(
      (s) => s.label.trim() && s.value.trim()
    );

    const filteredSizesTable = sizesTableList.filter(
      (r) => r.article_number.trim() || r.length?.trim() || r.cup_size?.trim()
    );

    // Derive distinct sizes from the sizes table rows if sizeOptionsText was not manually populated
    const derivedFromTable = Array.from(
      new Set(
        filteredSizesTable
          .map((r) => {
            if (r.cup_size && r.cup_size.trim() && r.cup_size.trim().toLowerCase() !== "standard") {
              return r.cup_size.trim();
            }
            if (r.length && r.length.trim() && r.length.trim().toLowerCase() !== "standard") {
              return r.length.trim();
            }
            return r.pattern?.trim() || "";
          })
          .filter(Boolean)
      )
    );

    const finalSizeOptions =
      parsedSizes.length > 0
        ? parsedSizes
        : derivedFromTable.length > 0
        ? derivedFromTable
        : [productForm.cup_size || productForm.length || "Standard"];

    const fullPayload: any = {
      ...productForm,
      size_options: finalSizeOptions,
      cup_size: finalSizeOptions[0] || productForm.cup_size || "Standard",
      specs: filteredSpecs,
      sizes_table: filteredSizesTable,
    };

    setProductSaving(true);
    try {
      if (editingProduct) {
        await updateProduct({
          ...editingProduct,
          ...fullPayload,
        } as ProductItem);
      } else {
        await addProduct(fullPayload as Omit<ProductItem, "id">);
      }
      setProductModalOpen(false);
      setEditingProduct(null);
      setProductForm({
        code: "",
        name: "",
        category: "general-instrumentation",
        subcategory: "",
        description: "",
        image: "",
        gallery: [],
        isFeatured: true,
        material: "",
        stock: "In Stock",
      });
      setSizeOptionsText("");
      setCustomSpecsList([]);
      setSizesTableList([]);
    } catch (err) {
      console.error("Error saving product:", err);
    } finally {
      setProductSaving(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteProduct(id);
    }
  };

  // Feature badges handlers for About Section
  const handleAddFeature = () => {
    const newFeature = {
      id: `feat-${Date.now()}`,
      icon: "cog",
      title: "",
    };
    setFormData((prev) => ({
      ...prev,
      aboutSection: {
        ...prev.aboutSection,
        features: [...(prev.aboutSection.features || []), newFeature],
      },
    }));
  };

  const handleUpdateFeature = (id: string, field: "title" | "icon", val: string) => {
    setFormData((prev) => ({
      ...prev,
      aboutSection: {
        ...prev.aboutSection,
        features: (prev.aboutSection.features || []).map((f) =>
          f.id === id ? { ...f, [field]: val } : f
        ),
      },
    }));
  };

  const handleDeleteFeature = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      aboutSection: {
        ...prev.aboutSection,
        features: (prev.aboutSection.features || []).filter((f) => f.id !== id),
      },
    }));
  };

  // Certification strip handlers for About Section
  const handleAddCertification = () => {
    const newCert = {
      id: `cert-${Date.now()}`,
      icon: "shield",
      name: "",
    };
    setFormData((prev) => ({
      ...prev,
      aboutSection: {
        ...prev.aboutSection,
        certifications: [...(prev.aboutSection.certifications || []), newCert],
      },
    }));
  };

  const handleUpdateCertification = (id: string, field: "name" | "icon", val: string) => {
    setFormData((prev) => ({
      ...prev,
      aboutSection: {
        ...prev.aboutSection,
        certifications: (prev.aboutSection.certifications || []).map((c) =>
          c.id === id ? { ...c, [field]: val } : c
        ),
      },
    }));
  };

  const handleDeleteCertification = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      aboutSection: {
        ...prev.aboutSection,
        certifications: (prev.aboutSection.certifications || []).filter((c) => c.id !== id),
      },
    }));
  };

  // About image helpers - updates draft state without premature auto-saving
  const handleRemoveAboutImage = () => {
    setFormData((prev) => ({
      ...prev,
      aboutSection: {
        ...prev.aboutSection,
        image: "",
      },
    }));
  };

  const handleResetAboutImage = () => {
    setFormData((prev) => ({
      ...prev,
      aboutSection: {
        ...prev.aboutSection,
        image: "/images/about-cleanroom.png",
      },
    }));
  };

  const handleRemoveFeatureImage = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      aboutSection: {
        ...prev.aboutSection,
        features: (prev.aboutSection.features || []).map((f: any) =>
          f.id === id ? { ...f, image: "" } : f
        ),
      },
    }));
  };

  const handleRemoveCertImage = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      aboutSection: {
        ...prev.aboutSection,
        certifications: (prev.aboutSection.certifications || []).map((c: any) =>
          c.id === id ? { ...c, image: "" } : c
        ),
      },
    }));
  };

  // ==============================================================
  // Product Categories Section Handlers
  // ==============================================================
  const handleAddCategory = () => {
    const currentCats = (formData as any).categoriesSection?.categories || [];
    const num = currentCats.length + 1;
    const formattedNum = num < 10 ? `0${num}` : `${num}`;
    const newCategory = {
      id: `cat-${Date.now()}`,
      number: formattedNum,
      title: "",
      subtitle: "",
      image: "",
      buttonText: "VIEW PRODUCT RANGE",
      buttonLink: "/products",
      buttonVariant: "outline",
    };
    setFormData((prev: any) => ({
      ...prev,
      categoriesSection: {
        ...prev.categoriesSection,
        categories: [...(prev.categoriesSection?.categories || []), newCategory],
      },
    }));
  };

  const handleUpdateCategory = (id: string, field: string, val: any) => {
    setFormData((prev: any) => ({
      ...prev,
      categoriesSection: {
        ...prev.categoriesSection,
        categories: (prev.categoriesSection?.categories || []).map((c: any) =>
          c.id === id ? { ...c, [field]: val } : c
        ),
      },
    }));
  };

  const handleDeleteCategory = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      categoriesSection: {
        ...prev.categoriesSection,
        categories: (prev.categoriesSection?.categories || []).filter((c: any) => c.id !== id),
      },
    }));
  };

  const handleCategoryFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    catId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCategoryCardId(catId);
    try {
      const uploadedPath = await uploadFileFast(file);
      if (uploadedPath) {
        handleUpdateCategory(catId, "image", uploadedPath);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("An error occurred during upload.");
    } finally {
      setUploadingCategoryCardId(null);
      e.target.value = "";
    }
  };

  const handleUpdateCategoryTrustBadge = (id: string, field: string, val: string) => {
    setFormData((prev: any) => ({
      ...prev,
      categoriesSection: {
        ...prev.categoriesSection,
        trustBadges: (prev.categoriesSection?.trustBadges || []).map((b: any) =>
          b.id === id ? { ...b, [field]: val } : b
        ),
      },
    }));
  };

  // ==============================================================
  // WHAT WE DO SECTION (Reliable Surgical Solutions) HANDLERS
  // ==============================================================
  const handleAddWhatWeDoCard = () => {
    const currentCards = (formData as any).whatWeDoSection?.cards || [];
    const num = currentCards.length + 1;
    const formattedNum = num < 10 ? `0${num}` : `${num}`;
    const newCard = {
      id: `wwd-${Date.now()}`,
      number: formattedNum,
      icon: "factory",
      title: "",
      description: "",
    };

    setFormData((prev: any) => ({
      ...prev,
      whatWeDoSection: {
        ...prev.whatWeDoSection,
        cards: [...(prev.whatWeDoSection?.cards || []), newCard],
      },
    }));
  };

  const handleUpdateWhatWeDoCard = (id: string, field: string, val: any) => {
    setFormData((prev: any) => ({
      ...prev,
      whatWeDoSection: {
        ...prev.whatWeDoSection,
        cards: (prev.whatWeDoSection?.cards || []).map((c: any) =>
          c.id === id ? { ...c, [field]: val } : c
        ),
      },
    }));
  };

  const handleDeleteWhatWeDoCard = (id: string) => {
    if (!confirm("Are you sure you want to delete this capability card?")) return;
    setFormData((prev: any) => ({
      ...prev,
      whatWeDoSection: {
        ...prev.whatWeDoSection,
        cards: (prev.whatWeDoSection?.cards || []).filter((c: any) => c.id !== id),
      },
    }));
  };

  const handleWhatWeDoLeftVisualUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingWhatWeDo(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedPath = data.url || data.filePath;
        if (uploadedPath) {
          setFormData((prev: any) => ({
            ...prev,
            whatWeDoSection: {
              ...prev.whatWeDoSection,
              leftVisual: {
                ...(prev.whatWeDoSection?.leftVisual || {}),
                image: uploadedPath,
              },
            },
          }));
        } else {
          alert("Upload completed but no path was returned.");
        }
      } else {
        alert("File upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("An error occurred during upload.");
    } finally {
      setIsUploadingWhatWeDo(false);
      e.target.value = "";
    }
  };

  const handleWhatWeDoCardIconUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    cardId: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingWhatWeDoCardId(cardId);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedPath = data.url || data.filePath;
        if (uploadedPath) {
          handleUpdateWhatWeDoCard(cardId, "customIcon", uploadedPath);
        } else {
          alert("Upload completed but no path was returned.");
        }
      } else {
        alert("File upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("An error occurred during upload.");
    } finally {
      setUploadingWhatWeDoCardId(null);
      e.target.value = "";
    }
  };

  // ==============================================================
  // VIDEO SHOWCASE HANDLERS (SS 1)
  // ==============================================================
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideoFile(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedPath = data.url || data.filePath;
        if (uploadedPath) {
          setFormData((prev: any) => ({
            ...prev,
            videoSection: {
              ...prev.videoSection,
              videoUrl: uploadedPath,
            },
          }));
        } else {
          alert("Video upload completed but no path was returned.");
        }
      } else {
        alert("Video upload failed.");
      }
    } catch (err) {
      console.error("Video upload error:", err);
      alert("An error occurred during video upload.");
    } finally {
      setIsUploadingVideoFile(false);
      e.target.value = "";
    }
  };

  const handleVideoBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideoBanner(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedPath = data.url || data.filePath;
        if (uploadedPath) {
          setFormData((prev: any) => ({
            ...prev,
            videoSection: {
              ...prev.videoSection,
              bannerImage: uploadedPath,
            },
          }));
        } else {
          alert("Banner upload completed but no path was returned.");
        }
      } else {
        alert("Banner upload failed.");
      }
    } catch (err) {
      console.error("Banner upload error:", err);
      alert("An error occurred during banner upload.");
    } finally {
      setIsUploadingVideoBanner(false);
      e.target.value = "";
    }
  };

  // ==============================================================
  // ADVANCED SOLUTIONS HANDLERS (SS 2)
  // ==============================================================
  const handleSolutionsBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingSolutionsBanner(true);
    try {
      const uploadedPath = await uploadFileFast(file);
      if (uploadedPath) {
        setFormData((prev: any) => ({
          ...prev,
          advancedSolutionsSection: {
            ...(prev as any).advancedSolutionsSection,
            bannerImage: uploadedPath,
          },
        }));
      } else {
        alert("Banner upload completed but no path was returned.");
      }
    } catch (err) {
      console.error("Banner upload error:", err);
      alert("An error occurred during banner upload.");
    } finally {
      setIsUploadingSolutionsBanner(false);
      e.target.value = "";
    }
  };

  const handleAddSolutionsCard = () => {
    const newCard = {
      id: `cap-${Date.now()}`,
      icon: "book",
      title: "",
      description: "",
      linkText: "View Catalogs",
      linkUrl: "/catalog",
    };
    setFormData((prev: any) => ({
      ...prev,
      advancedSolutionsSection: {
        ...(prev as any).advancedSolutionsSection,
        capabilitiesCards: [
          ...((prev as any).advancedSolutionsSection?.capabilitiesCards || []),
          newCard,
        ],
      },
    }));
  };

  const handleDeleteSolutionsCard = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      advancedSolutionsSection: {
        ...(prev as any).advancedSolutionsSection,
        capabilitiesCards: ((prev as any).advancedSolutionsSection?.capabilitiesCards || []).filter(
          (c: any) => c.id !== id
        ),
      },
    }));
  };

  // ==============================================================
  // GLOBAL STANDARDS & EXPORTS HANDLERS (SS 2)
  // ==============================================================
  const handleCompImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCompImage(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedPath = data.url || data.filePath;
        if (uploadedPath) {
          setFormData((prev: any) => ({
            ...prev,
            globalStandardsSection: {
              ...(prev as any).globalStandardsSection,
              compImage: uploadedPath,
            },
          }));
        }
      }
    } catch (err) {
      console.error("Comp image upload error:", err);
    } finally {
      setIsUploadingCompImage(false);
      e.target.value = "";
    }
  };

  const handleToolsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingToolsImage(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedPath = data.url || data.filePath;
        if (uploadedPath) {
          setFormData((prev: any) => ({
            ...prev,
            globalStandardsSection: {
              ...(prev as any).globalStandardsSection,
              toolsImage: uploadedPath,
            },
          }));
        }
      }
    } catch (err) {
      console.error("Tools image upload error:", err);
    } finally {
      setIsUploadingToolsImage(false);
      e.target.value = "";
    }
  };

  const handleGlobeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingGlobeImage(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (res.ok) {
        const data = await res.json();
        const uploadedPath = data.url || data.filePath;
        if (uploadedPath) {
          setFormData((prev: any) => ({
            ...prev,
            globalStandardsSection: {
              ...(prev as any).globalStandardsSection,
              exportGlobeImage: uploadedPath,
            },
          }));
        }
      }
    } catch (err) {
      console.error("Globe image upload error:", err);
    } finally {
      setIsUploadingGlobeImage(false);
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 w-full max-w-full overflow-x-hidden">
      {/* Admin Top Navigation Bar */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-lg w-full overflow-hidden">
        <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
              title="Return to Website"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#ED1C24] flex items-center justify-center text-white font-black text-sm">
                ET
              </div>
              <div>
                <h1 className="text-base font-bold leading-tight flex items-center gap-2">
                  <span>Endo Tech</span>
                  <span className="text-[10px] bg-[#1B459B] px-2 py-0.5 rounded uppercase tracking-wider">
                    Dynamic Admin
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400">
                  Live Multi-Device Content & Product Manager
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => refreshData()}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
              title="Sync with Server"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Sync Live</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleSaveContent}
              disabled={isSaving}
              className="px-5 py-2 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Save Notifications */}
      {saveSuccess && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md animate-fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>
            Changes saved successfully! Your website is now updated live across all devices.
          </span>
        </div>
      )}

      {saveError && (
        <div className="bg-red-600 text-white px-4 py-2.5 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md">
          <AlertCircle className="w-4 h-4" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Admin Body Container */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2200px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Admin Tabs Sidebar (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1">
                Management Modules
              </div>

              {/* GROUP 1: HOME PAGE SECTIONS (COLLAPSIBLE) */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setHomeSectionsOpen(!homeSectionsOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-700 hover:bg-slate-100 transition"
                >
                  <span className="flex items-center gap-2">
                    <Layout className="w-4 h-4 text-[#1B459B]" />
                    <span>Home Page Sections (7)</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      homeSectionsOpen ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>

                {homeSectionsOpen && (
                  <div className="pl-2 space-y-1 border-l-2 border-slate-100 ml-2">
                    <button
                      onClick={() => setActiveTab("hero")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                        activeTab === "hero"
                          ? "bg-[#1B459B] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Hero Section &amp; Banner</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("about")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                        activeTab === "about"
                          ? "bg-[#1B459B] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Layout className="w-3.5 h-3.5" />
                      <span>About Section (35+ Years)</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("categories")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                        activeTab === "categories"
                          ? "bg-[#1B459B] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Product Categories</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("what-we-do")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                        activeTab === "what-we-do"
                          ? "bg-[#1B459B] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>What We Do Section</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("video")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                        activeTab === "video"
                          ? "bg-[#1B459B] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <VideoIcon className="w-3.5 h-3.5" />
                      <span>Facility Video Showcase</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("solutions")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                        activeTab === "solutions"
                          ? "bg-[#1B459B] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Advanced Solutions &amp; Inquiry</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("standards")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                        activeTab === "standards"
                          ? "bg-[#1B459B] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Globe2 className="w-3.5 h-3.5" />
                      <span>Global Compliances &amp; Exports</span>
                    </button>
                  </div>
                )}
              </div>

              {/* GROUP 2: PRODUCTS PAGE MANAGEMENT (COLLAPSIBLE) */}
              <div className="space-y-1 pt-2">
                <button
                  type="button"
                  onClick={() => setProductsSectionOpen(!productsSectionOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-700 hover:bg-slate-100 transition"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#ED1C24]" />
                    <span>Products Page Management</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      productsSectionOpen ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>

                {productsSectionOpen && (
                  <div className="pl-2 space-y-1 border-l-2 border-slate-100 ml-2">
                    <button
                      onClick={() => setActiveTab("product-page")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                        activeTab === "product-page"
                          ? "bg-[#1B459B] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>Categories &amp; Hero Banner</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("products")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                        activeTab === "products"
                          ? "bg-[#1B459B] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Products Catalog &amp; Images ({products.length})</span>
                    </button>
                  </div>
                )}
              </div>

              {/* GROUP 3: OTHER WEBSITE PAGES (COLLAPSIBLE) */}
              <div className="space-y-1 pt-2">
                <button
                  type="button"
                  onClick={() => setOtherPagesOpen(!otherPagesOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-slate-700 hover:bg-slate-100 transition"
                >
                  <span className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-emerald-600" />
                    <span>Other Website Pages (4)</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      otherPagesOpen ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>

                {otherPagesOpen && (
                  <div className="pl-2 space-y-1 border-l-2 border-slate-100 ml-2">
                    <button
                      onClick={() => setActiveTab("page-about")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                        activeTab === "page-about"
                          ? "bg-[#1B459B] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Layout className="w-3.5 h-3.5" />
                      <span>About Us Page</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("page-departments")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                        activeTab === "page-departments"
                          ? "bg-[#1B459B] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Departments Page</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("page-resources")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                        activeTab === "page-resources"
                          ? "bg-[#1B459B] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Resources &amp; Catalogues</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("page-sustainability")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                        activeTab === "page-sustainability"
                          ? "bg-[#1B459B] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Sustainability Page</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("page-contact")}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                        activeTab === "page-contact"
                          ? "bg-[#1B459B] text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Contact Us Page</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab("preview")}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition ${activeTab === "preview"
                    ? "bg-[#1B459B] text-white shadow-md shadow-[#1B459B]/20"
                    : "text-slate-700 hover:bg-slate-100"
                  }`}
              >
                <Eye className="w-4 h-4" />
                <span>Live Website Preview</span>
              </button>
            </div>

            {/* Quick Status Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Real-Time Sync Active</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Any changes made here are immediately saved to the server backend. Refreshing the
                page retains your changes, and any other connected device automatically reflects the
                updates.
              </p>
            </div>
          </div>

          {/* Right Editor Area (9 cols) */}
          <div className="lg:col-span-9 space-y-6 min-w-0 max-w-full">
            {/* ============================================================== */}
            {/* TAB 1: HERO SECTION & BANNER                                   */}
            {/* ============================================================== */}
            {activeTab === "hero" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Hero Section & Banner Manager
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage homepage hero banner, headline texts, button, and image.
                    </p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs font-bold text-slate-700">Section Enabled</span>
                    <input
                      type="checkbox"
                      checked={formData.hero.enabled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, enabled: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-[#ED1C24] rounded accent-[#ED1C24]"
                    />
                  </label>
                </div>

                {/* Real-time Hero Card Preview */}
                <div className="p-4 bg-[#DADEE6] rounded-2xl border border-slate-300 space-y-2">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="w-3.5 h-3.5 text-[#1B459B]" />
                      <span>Live Hero Banner Preview</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          hero: {
                            ...formData.hero,
                            bannerImage: "/images/rect1090.jpg",
                            tagline: "PRECISION  /  QUALITY  /  BETTER CARE",
                            titleLine1: "Kerrison",
                            titleHighlight: "Rongeur",
                            titleLine3: "I N S T R U M E N T S",
                            subtitleLine1: "Engineered for Precision.",
                            subtitleLine2: "Trusted in Every Procedure.",
                            primaryBtnText: "View Collection",
                            primaryBtnLink: "/products",
                          },
                        })
                      }
                      className="text-[10px] text-[#1B459B] hover:underline font-bold"
                    >
                      Reset Default Banner
                    </button>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                    <InteractiveHeroCard hero={formData.hero} isPreview={true} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tagline */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Top Tagline (with | divider)
                    </label>
                    <input
                      type="text"
                      value={formData.hero.tagline ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, tagline: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#1B459B] focus:outline-none"
                    />
                  </div>

                  {/* Line 1 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Headline Line 1 (Black Color)
                    </label>
                    <input
                      type="text"
                      value={formData.hero.titleLine1 ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, titleLine1: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#1B459B] focus:outline-none"
                    />
                  </div>

                  {/* Red Highlight */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Headline Line 2 (Bright Red Highlight)
                    </label>
                    <input
                      type="text"
                      value={formData.hero.titleHighlight ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, titleHighlight: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#1B459B] focus:outline-none"
                    />
                  </div>

                  {/* Line 3 Tracked */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Headline Line 3 (Tracked Text)
                    </label>
                    <input
                      type="text"
                      value={formData.hero.titleLine3 ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, titleLine3: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#1B459B] focus:outline-none"
                    />
                  </div>

                  {/* Subtitle Line 1 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Subtitle Line 1
                    </label>
                    <input
                      type="text"
                      value={formData.hero.subtitleLine1 ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, subtitleLine1: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#1B459B] focus:outline-none"
                    />
                  </div>

                  {/* Subtitle Line 2 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Subtitle Line 2
                    </label>
                    <input
                      type="text"
                      value={formData.hero.subtitleLine2 ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, subtitleLine2: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#1B459B] focus:outline-none"
                    />
                  </div>

                  {/* Banner Image Visual & Upload Box */}
                  <div className="md:col-span-2 space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          Hero Instruments Visual / Banner Image
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Upload new surgical instruments photo or custom hero banner graphic.
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1B459B] border border-blue-200">
                        {formData.hero.bannerImage && formData.hero.bannerImage !== "/images/rect1090.jpg"
                          ? "Custom Uploaded Photo"
                          : "Default Kerrison Instruments"}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {/* Image Thumbnail */}
                      <div className="w-28 h-20 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            formData.hero.bannerImage && formData.hero.bannerImage !== "/images/rect1090.jpg"
                              ? formData.hero.bannerImage
                              : "/images/hero-instruments.png"
                          }
                          alt="Hero Thumbnail"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="px-4 py-2 bg-[#1B459B] hover:bg-[#153678] text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm">
                            {isUploadingHero ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Uploading & Saving...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload New Photo</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploadingHero}
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, "hero.bannerImage")}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                hero: { ...formData.hero, bannerImage: "/images/rect1090.jpg" },
                              });
                            }}
                            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition"
                          >
                            Reset Default Instruments
                          </button>

                          {formData.hero.bannerImage && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  hero: { ...formData.hero, bannerImage: "" },
                                });
                              }}
                              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        {/* Direct Path Input */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500 shrink-0">Path/URL:</span>
                          <input
                            type="text"
                            value={formData.hero.bannerImage ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                hero: { ...formData.hero, bannerImage: e.target.value },
                              })
                            }
                            placeholder="/images/hero-instruments.png or /uploads/..."
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#1B459B] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Button Text */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.hero.primaryBtnText ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, primaryBtnText: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#1B459B] focus:outline-none"
                    />
                  </div>

                  {/* Button Link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Button Link
                    </label>
                    <input
                      type="text"
                      value={formData.hero.primaryBtnLink ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, primaryBtnLink: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-[#1B459B] focus:outline-none"
                    />
                  </div>

                  {/* Feature Badges Editor */}
                  <div className="md:col-span-2 space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs font-bold text-slate-700">
                      Hero Bottom Feature Badges (3 Badges)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {(formData.hero.badges || [
                        { icon: "shield", title: "SURGICAL", desc: "GRADE STEEL" },
                        { icon: "crosshair", title: "PRECISION", desc: "ENGINEERED" },
                        { icon: "infinity", title: "DURABLE", desc: "PERFORMANCE" },
                      ]).map((badge, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-3 rounded-xl border border-slate-200 space-y-2 shadow-xs"
                        >
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Badge #{idx + 1}
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-slate-500">
                              Title Line 1
                            </label>
                            <input
                              type="text"
                              value={badge.title ?? ""}
                              onChange={(e) => {
                                const newBadges = [
                                  ...(formData.hero.badges || [
                                    { icon: "shield", title: "SURGICAL", desc: "GRADE STEEL" },
                                    { icon: "crosshair", title: "PRECISION", desc: "ENGINEERED" },
                                    { icon: "infinity", title: "DURABLE", desc: "PERFORMANCE" },
                                  ]),
                                ];
                                newBadges[idx] = { ...newBadges[idx], title: e.target.value };
                                setFormData({
                                  ...formData,
                                  hero: { ...formData.hero, badges: newBadges },
                                });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold text-slate-500">
                              Subtitle Line 2
                            </label>
                            <input
                              type="text"
                              value={badge.desc ?? ""}
                              onChange={(e) => {
                                const newBadges = [
                                  ...(formData.hero.badges || [
                                    { icon: "shield", title: "SURGICAL", desc: "GRADE STEEL" },
                                    { icon: "crosshair", title: "PRECISION", desc: "ENGINEERED" },
                                    { icon: "infinity", title: "DURABLE", desc: "PERFORMANCE" },
                                  ]),
                                ];
                                newBadges[idx] = { ...newBadges[idx], desc: e.target.value };
                                setFormData({
                                  ...formData,
                                  hero: { ...formData.hero, badges: newBadges },
                                });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSaveContent}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Hero Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: ABOUT SECTION ("BUILT TO SUPPORT SURGERY")                */}
            {/* ============================================================== */}
            {activeTab === "about" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ED1C24]" />
                      <h2 className="text-xl font-black text-slate-900">
                        &quot;Built To Support Surgery&quot; Section Manager
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Directly control the section below Hero: edit texts, upload/change/delete cleanroom image, add/delete feature badges and bottom certifications.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
                      <input
                        type="checkbox"
                        checked={formData.aboutSection.enabled !== false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            aboutSection: {
                              ...formData.aboutSection,
                              enabled: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-[#ED1C24] rounded accent-[#ED1C24]"
                      />
                      <span>Section Visible</span>
                    </label>

                    <button
                      onClick={handleSaveContent}
                      disabled={isSaving}
                      className="px-5 py-2 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                </div>

                {/* Real-Time Live Preview Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#1B459B]" />
                      <span>Live Section Preview (Updates in real-time as you type)</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Matches the homepage layout
                    </span>
                  </div>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden bg-slate-50 shadow-inner">
                    <AboutSection previewData={formData.aboutSection} />
                  </div>
                </div>

                {/* Two Column Layout: Left Content & Right Media */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column (7 cols): Texts & Feature Badges */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#ED1C24]" />
                        <span>Header & Heading Texts</span>
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">
                            Tag / Badge
                          </label>
                          <input
                            type="text"
                            value={formData.aboutSection.badge ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                aboutSection: {
                                  ...formData.aboutSection,
                                  badge: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:outline-none"
                            placeholder="ABOUT US"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">
                            Title Line 1 (Black text)
                          </label>
                          <input
                            type="text"
                            value={formData.aboutSection.titleLine1 ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                aboutSection: {
                                  ...formData.aboutSection,
                                  titleLine1: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:outline-none"
                            placeholder="Built To Support"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">
                            Title Highlight (Red text)
                          </label>
                          <input
                            type="text"
                            value={formData.aboutSection.titleHighlight ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                aboutSection: {
                                  ...formData.aboutSection,
                                  titleHighlight: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs text-[#ED1C24] font-bold focus:outline-none"
                            placeholder="Surgery"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">
                          Introductory Lead Paragraph
                        </label>
                        <textarea
                          rows={3}
                          value={formData.aboutSection.intro ?? ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              aboutSection: {
                                ...formData.aboutSection,
                                intro: e.target.value,
                                description: e.target.value,
                              },
                            })
                          }
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:outline-none"
                          placeholder="Established in 1990, Endo Tech Group of Indutries..."
                        />
                      </div>
                    </div>

                    {/* Feature Badges Manager with Image / Icon Upload Placeholder */}
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-[#1B459B]" />
                            <span>Feature Badges (Sustainable, Automation, Delivery)</span>
                          </h3>
                          <p className="text-[10px] text-slate-500">
                            Upload custom image/icon or choose preset icon, edit title, or delete badges.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddFeature}
                          className="px-3 py-1.5 bg-[#1B459B] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Badge</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {(formData.aboutSection.features || []).map((feat, idx) => (
                          <div
                            key={feat.id || idx}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs"
                          >
                            <span className="w-6 text-[10px] font-bold text-slate-400 text-center shrink-0">
                              #{idx + 1}
                            </span>

                            {/* Image / Icon Upload Placeholder Box */}
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="w-12 h-12 rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden shrink-0 group hover:border-[#1B459B] transition">
                                {(feat as any).image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={(feat as any).image}
                                    alt={feat.title || "Icon"}
                                    className="w-full h-full object-contain p-1"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center text-slate-600">
                                    {feat.icon === "factory" && <Factory className="w-5 h-5 text-slate-700" />}
                                    {feat.icon === "cog" && <Cog className="w-5 h-5 text-[#ED1C24]" />}
                                    {feat.icon === "truck" && <Truck className="w-5 h-5 text-[#ED1C24]" />}
                                    {feat.icon === "shield" && <ShieldCheck className="w-5 h-5 text-[#1B459B]" />}
                                    {feat.icon === "award" && <Award className="w-5 h-5 text-[#1B459B]" />}
                                    {feat.icon === "globe" && <Globe2 className="w-5 h-5 text-[#1B459B]" />}
                                    {(!feat.icon || feat.icon === "sparkles") && <Sparkles className="w-5 h-5 text-[#ED1C24]" />}
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col gap-1">
                                <label className="cursor-pointer px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold transition flex items-center gap-1 border border-slate-300 shadow-2xs">
                                  <Upload className="w-3 h-3 text-[#1B459B]" />
                                  <span>Upload Icon</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, `aboutSection.feature.${feat.id}`)}
                                  />
                                </label>
                                {(feat as any).image && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFeatureImage(feat.id)}
                                    className="text-[10px] text-red-600 hover:underline font-semibold text-left"
                                  >
                                    Remove Icon
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Preset Icon Selector */}
                            <div className="w-36 shrink-0">
                              <select
                                value={feat.icon ?? "cog"}
                                onChange={(e) =>
                                  handleUpdateFeature(feat.id, "icon", e.target.value)
                                }
                                className="w-full px-2.5 py-2 bg-slate-50 rounded-lg border border-slate-300 text-xs focus:outline-none"
                              >
                                <option value="factory">Factory (Sustainable)</option>
                                <option value="cog">Cog (Automation)</option>
                                <option value="truck">Truck (Delivery)</option>
                                <option value="shield">Shield</option>
                                <option value="award">Award</option>
                                <option value="sparkles">Sparkles</option>
                                <option value="globe">Globe</option>
                              </select>
                            </div>

                            {/* Title text input */}
                            <input
                              type="text"
                              value={feat.title ?? ""}
                              onChange={(e) =>
                                handleUpdateFeature(feat.id, "title", e.target.value)
                              }
                              className="flex-1 w-full px-3 py-2 bg-slate-50 rounded-lg border border-slate-300 text-xs focus:outline-none font-semibold text-slate-800"
                              placeholder="Feature Title (e.g. Sustainable Manufacturing)"
                            />

                            {/* Delete badge button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteFeature(feat.id)}
                              className="p-2 text-slate-400 hover:text-white hover:bg-red-500 rounded-lg transition shrink-0"
                              title="Delete this badge"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}

                        {(!formData.aboutSection.features ||
                          formData.aboutSection.features.length === 0) && (
                            <div className="text-center py-6 text-xs text-slate-400 bg-white rounded-lg border border-dashed border-slate-200">
                              No feature badges. Click &quot;Add Badge&quot; to add one.
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Story Paragraphs & Buttons */}
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        Story Paragraphs & Call-to-Actions
                      </h3>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">
                            Paragraph 1 (Craftsmanship & Capabilities)
                          </label>
                          <textarea
                            rows={3}
                            value={formData.aboutSection.paragraph1 ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                aboutSection: {
                                  ...formData.aboutSection,
                                  paragraph1: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:outline-none"
                            placeholder="With decades of expertise, we combine advanced technology..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">
                            Paragraph 2 (Quality & Global Commitments)
                          </label>
                          <textarea
                            rows={3}
                            value={formData.aboutSection.paragraph2 ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                aboutSection: {
                                  ...formData.aboutSection,
                                  paragraph2: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:outline-none"
                            placeholder="Our commitment to quality is backed by ISO 9001..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">
                            Primary Button Text
                          </label>
                          <input
                            type="text"
                            value={formData.aboutSection.primaryBtnText ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                aboutSection: {
                                  ...formData.aboutSection,
                                  primaryBtnText: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:outline-none"
                            placeholder="EXPLORE OUR PRODUCTS"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">
                            Primary Button Link
                          </label>
                          <input
                            type="text"
                            value={formData.aboutSection.primaryBtnLink ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                aboutSection: {
                                  ...formData.aboutSection,
                                  primaryBtnLink: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:outline-none"
                            placeholder="/products"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">
                            Secondary Button Text
                          </label>
                          <input
                            type="text"
                            value={formData.aboutSection.secondaryBtnText ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                aboutSection: {
                                  ...formData.aboutSection,
                                  secondaryBtnText: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:outline-none"
                            placeholder="LEARN MORE"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">
                            Secondary Button Link
                          </label>
                          <input
                            type="text"
                            value={formData.aboutSection.secondaryBtnLink ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                aboutSection: {
                                  ...formData.aboutSection,
                                  secondaryBtnLink: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:outline-none"
                            placeholder="/about"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (5 cols): Cleanroom Image & Experience Badge */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                          <ImageIcon className="w-3.5 h-3.5 text-[#ED1C24]" />
                          <span>Cleanroom Facility Visual</span>
                        </h3>
                        {formData.aboutSection.image && (
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Image Set
                          </span>
                        )}
                      </div>

                      {/* Image Preview Box */}
                      <div className="relative rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 aspect-[4/3] flex items-center justify-center group">
                        {formData.aboutSection.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={formData.aboutSection.image}
                            alt="Cleanroom visual"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-6 text-slate-400">
                            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-xs font-semibold">No Image Selected</p>
                          </div>
                        )}

                        {/* Overlay Experience Preview */}
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-2 rounded-xl border border-slate-200 shadow-md text-center">
                          <span className="text-lg font-black text-[#ED1C24] leading-none block">
                            {formData.aboutSection.experienceBadge?.number ?? "35+"}
                          </span>
                          <span className="text-[8px] font-bold text-slate-700 uppercase tracking-wider block mt-0.5">
                            {formData.aboutSection.experienceBadge?.label ?? "YEARS OF EXPERIENCE"}
                          </span>
                        </div>
                      </div>

                      {/* Image Action Buttons */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="flex-1 cursor-pointer bg-[#1B459B] hover:bg-blue-800 text-white px-3 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs">
                            {isUploadingAbout ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Uploading & Saving...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload New Photo</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploadingAbout}
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, "aboutSection.image")}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={handleRemoveAboutImage}
                            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleResetAboutImage}
                            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                            title="Reset to cleanroom reference photo"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Reset</span>
                          </button>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">
                            Or enter Image Path / URL directly:
                          </label>
                          <input
                            type="text"
                            value={formData.aboutSection.image ?? ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                aboutSection: {
                                  ...formData.aboutSection,
                                  image: e.target.value,
                                },
                              })
                            }
                            className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-mono focus:outline-none"
                            placeholder="/images/about-cleanroom.png"
                          />
                        </div>
                      </div>

                      {/* Floating Experience Badge Controls */}
                      <div className="border-t border-slate-200 pt-3 space-y-3">
                        <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                          Floating Experience Badge
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500">
                              Number / Stat
                            </label>
                            <input
                              type="text"
                              value={formData.aboutSection.experienceBadge?.number ?? ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  aboutSection: {
                                    ...formData.aboutSection,
                                    experienceBadge: {
                                      ...formData.aboutSection.experienceBadge,
                                      number: e.target.value,
                                      label:
                                        formData.aboutSection.experienceBadge?.label ||
                                        "YEARS OF EXPERIENCE",
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-bold text-[#ED1C24] focus:outline-none"
                              placeholder="35+"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500">
                              Label
                            </label>
                            <input
                              type="text"
                              value={formData.aboutSection.experienceBadge?.label ?? ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  aboutSection: {
                                    ...formData.aboutSection,
                                    experienceBadge: {
                                      ...formData.aboutSection.experienceBadge,
                                      number:
                                        formData.aboutSection.experienceBadge?.number || "35+",
                                      label: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-1.5 bg-white rounded-lg border border-slate-300 text-xs font-bold focus:outline-none"
                              placeholder="YEARS OF EXPERIENCE"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Certifications Strip Manager with Image / Icon Upload Placeholder */}
                <div className="bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-[#ED1C24]" />
                        <span>Footer Certifications Strip (ISO, CE, FDA, CPRA/EU-MDR)</span>
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        Upload custom certification badge/logo or choose preset icon, edit name, or delete certifications.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddCertification}
                      className="self-start sm:self-auto px-3.5 py-1.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Certification</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(formData.aboutSection.certifications || []).map((cert, idx) => (
                      <div
                        key={cert.id || idx}
                        className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 relative group shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Badge #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteCertification(cert.id)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-red-500 rounded-md transition"
                            title="Delete this certification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Upload Placeholder / Preview Box */}
                        <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                            {(cert as any).image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={(cert as any).image}
                                alt={cert.name || "Cert"}
                                className="w-full h-full object-contain p-0.5"
                              />
                            ) : (
                              <div className="text-slate-600">
                                {cert.icon === "shield" && <ShieldCheck className="w-4 h-4 text-slate-700" />}
                                {cert.icon === "award" && <Award className="w-4 h-4 text-slate-700" />}
                                {cert.icon === "check" && <CheckCircle2 className="w-4 h-4 text-slate-700" />}
                                {cert.icon === "badge" && <Building2 className="w-4 h-4 text-slate-700" />}
                                {cert.icon === "globe" && <Globe2 className="w-4 h-4 text-slate-700" />}
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 text-[10px] font-bold shadow-2xs transition">
                              <Upload className="w-3 h-3 text-[#ED1C24]" />
                              <span>Upload Logo / Icon</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, `aboutSection.certification.${cert.id}`)}
                              />
                            </label>
                            {(cert as any).image && (
                              <button
                                type="button"
                                onClick={() => handleRemoveCertImage(cert.id)}
                                className="block text-[9px] text-red-600 hover:underline font-semibold mt-0.5"
                              >
                                Remove custom logo
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-500">
                            Or Preset Icon Type
                          </label>
                          <select
                            value={cert.icon ?? "shield"}
                            onChange={(e) =>
                              handleUpdateCertification(cert.id, "icon", e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-300 text-xs focus:outline-none"
                          >
                            <option value="shield">Shield (ISO)</option>
                            <option value="award">Award Ribbon (ISO 13485)</option>
                            <option value="check">Checkmark (CE Mark)</option>
                            <option value="badge">Building / Agency (FDA)</option>
                            <option value="globe">Globe (CPRA / EU-MDR)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-500">
                            Certification Name
                          </label>
                          <input
                            type="text"
                            value={cert.name ?? ""}
                            onChange={(e) =>
                              handleUpdateCertification(cert.id, "name", e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-300 text-xs font-bold uppercase focus:outline-none"
                            placeholder="e.g. ISO 9001"
                          />
                        </div>
                      </div>
                    ))}

                    {(!formData.aboutSection.certifications ||
                      formData.aboutSection.certifications.length === 0) && (
                        <div className="sm:col-span-2 lg:col-span-3 text-center py-6 text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                          No certifications configured. Click &quot;Add Certification&quot; to add one.
                        </div>
                      )}
                  </div>
                </div>

                {/* Bottom Save Action Bar */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                  <div />

                  <button
                    onClick={handleSaveContent}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-7 py-3 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving Live..." : "Save About Changes"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: PRODUCT CATEGORIES MANAGER (Your Global Partner...)       */}
            {/* ============================================================== */}
            {activeTab === "categories" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Product Categories Manager
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage homepage product categories section, character-animated headlines, 3 trust badges, and category cards.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData as any).categoriesSection?.enabled ?? true}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            categoriesSection: {
                              ...prev.categoriesSection,
                              enabled: e.target.checked,
                            },
                          }))
                        }
                        className="w-4 h-4 text-[#1B459B] rounded focus:ring-[#1B459B]"
                      />
                      <span>Section Enabled</span>
                    </label>
                  </div>
                </div>

                {/* 1. Header & Heading Texts */}
                <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200/70">
                    <Sparkles className="w-4 h-4 text-[#ED1C24]" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Header & Heading Texts (Character-by-Character Animated)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Tag / Badge
                      </label>
                      <input
                        type="text"
                        value={(formData as any).categoriesSection?.tag || ""}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            categoriesSection: {
                              ...prev.categoriesSection,
                              tag: e.target.value,
                            },
                          }))
                        }
                        placeholder="OUR PRODUCT CATEGORIES"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#1B459B] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Title Line 1 (Navy text)
                      </label>
                      <input
                        type="text"
                        value={(formData as any).categoriesSection?.titleLine1 || ""}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            categoriesSection: {
                              ...prev.categoriesSection,
                              titleLine1: e.target.value,
                            },
                          }))
                        }
                        placeholder="Your Global Partner In Medical"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-[#1B459B] focus:outline-none focus:border-[#1B459B] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Title Highlight (Red text)
                      </label>
                      <input
                        type="text"
                        value={(formData as any).categoriesSection?.titleHighlight || ""}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            categoriesSection: {
                              ...prev.categoriesSection,
                              titleHighlight: e.target.value,
                            },
                          }))
                        }
                        placeholder="Instrument Manufacturing"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-[#ED1C24] focus:outline-none focus:border-[#ED1C24] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Introductory Lead Paragraph
                    </label>
                    <textarea
                      rows={2}
                      value={(formData as any).categoriesSection?.description || ""}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          categoriesSection: {
                            ...prev.categoriesSection,
                            description: e.target.value,
                          },
                        }))
                      }
                      placeholder="High-Quality Instruments Designed For Precision, Performance And Patient Safety..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-normal focus:outline-none focus:border-[#1B459B] transition leading-relaxed"
                    />
                  </div>
                </div>

                {/* 3. Top Right Trust Badges Strip (3 items) */}
                <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#1B459B]" />
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Top Right Trust Badges (Quality, Engineering, Standards)
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Configured across the top right of the section
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {((formData as any).categoriesSection?.trustBadges || []).map(
                      (badge: any, index: number) => (
                        <div
                          key={badge.id || index}
                          className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs"
                        >
                          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Trust Badge #{index + 1}
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Icon Type
                            </label>
                            <select
                              value={badge.icon || "shield"}
                              onChange={(e) =>
                                handleUpdateCategoryTrustBadge(badge.id, "icon", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#1B459B]"
                            >
                              <option value="shield">Shield (Quality & Reliability)</option>
                              <option value="crosshair">Crosshair (Precision Target)</option>
                              <option value="gears">Gears (Global Standards / ISO)</option>
                              <option value="award">Award Ribbon</option>
                              <option value="check">Checkmark Circle</option>
                              <option value="globe">Globe (International)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={badge.title || ""}
                              onChange={(e) =>
                                handleUpdateCategoryTrustBadge(badge.id, "title", e.target.value)
                              }
                              placeholder="e.g. Premium Quality"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1B459B]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">
                              Subtitle
                            </label>
                            <input
                              type="text"
                              value={badge.subtitle || ""}
                              onChange={(e) =>
                                handleUpdateCategoryTrustBadge(badge.id, "subtitle", e.target.value)
                              }
                              placeholder="e.g. Built for Reliability"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 focus:outline-none focus:border-[#1B459B]"
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* 4. Product Category Cards Manager */}
                <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
                    <div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#1B459B]" />
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Product Category Cards
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Upload custom instrument photography, edit numbers, titles, descriptions, and buttons.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-4 py-2 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Category</span>
                    </button>
                  </div>

                  {/* Category Cards List */}
                  <div className="space-y-5">
                    {((formData as any).categoriesSection?.categories || []).map(
                      (cat: any, index: number) => (
                        <div
                          key={cat.id || index}
                          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 relative group"
                        >
                          {/* Card Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-[#ED1C24] text-white text-xs font-black flex items-center justify-center">
                                {index + 1}
                              </span>
                              <span className="text-xs font-black text-slate-800 uppercase">
                                {cat.number} {cat.title || "Category Item"}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete this category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* 2-Column: Photo Upload on Left, Fields on Right */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                            {/* Left: Image Preview & Upload Controls */}
                            <div className="lg:col-span-4 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col items-center space-y-3">
                              <div className="w-full aspect-[4/3] rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-2 relative shadow-inner">
                                {cat.image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={cat.image}
                                    alt={cat.title || "Category"}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <div className="text-center text-xs text-slate-400">
                                    No Photo Uploaded
                                  </div>
                                )}
                              </div>

                              <div className="w-full space-y-2">
                                <label
                                  className={`w-full py-2 bg-[#1B459B] hover:bg-[#15367a] text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs ${uploadingCategoryCardId === cat.id ? "opacity-60 pointer-events-none" : ""
                                    }`}
                                >
                                  {uploadingCategoryCardId === cat.id ? (
                                    <>
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                      <span>Uploading Photo...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-3.5 h-3.5" />
                                      <span>Upload New Photo</span>
                                    </>
                                  )}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    disabled={uploadingCategoryCardId === cat.id}
                                    onChange={(e) => handleCategoryFileUpload(e, cat.id)}
                                  />
                                </label>

                                <input
                                  type="text"
                                  value={cat.image || ""}
                                  onChange={(e) =>
                                    handleUpdateCategory(cat.id, "image", e.target.value)
                                  }
                                  placeholder="/images/categories/..."
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-mono text-slate-600 focus:outline-none focus:border-[#1B459B]"
                                />
                              </div>
                            </div>

                            {/* Right: Card Inputs */}
                            <div className="lg:col-span-8 space-y-4">
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                    Number (Red Label)
                                  </label>
                                  <input
                                    type="text"
                                    value={cat.number || ""}
                                    onChange={(e) =>
                                      handleUpdateCategory(cat.id, "number", e.target.value)
                                    }
                                    placeholder="01"
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black text-[#ED1C24] focus:outline-none focus:border-[#ED1C24]"
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                    Category Title
                                  </label>
                                  <input
                                    type="text"
                                    value={cat.title || ""}
                                    onChange={(e) =>
                                      handleUpdateCategory(cat.id, "title", e.target.value)
                                    }
                                    placeholder="GENERAL SURGERY"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-800 uppercase focus:outline-none focus:border-[#1B459B]"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                  Subtitle / Description
                                </label>
                                <input
                                  type="text"
                                  value={cat.subtitle || ""}
                                  onChange={(e) =>
                                    handleUpdateCategory(cat.id, "subtitle", e.target.value)
                                  }
                                  placeholder="Precision Instruments For All Surgical Discipline"
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-[#1B459B]"
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                    Button Text
                                  </label>
                                  <input
                                    type="text"
                                    value={cat.buttonText || ""}
                                    onChange={(e) =>
                                      handleUpdateCategory(cat.id, "buttonText", e.target.value)
                                    }
                                    placeholder="VIEW PRODUCT RANGE"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1B459B]"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                    Button Link
                                  </label>
                                  <input
                                    type="text"
                                    value={cat.buttonLink || ""}
                                    onChange={(e) =>
                                      handleUpdateCategory(cat.id, "buttonLink", e.target.value)
                                    }
                                    placeholder="/products"
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-[#1B459B]"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                                    Button Behavior
                                  </label>
                                  <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#1B459B] shrink-0" />
                                    <span>Outline Navy (Turns Red on Hover)</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      )
                    )}

                    {(!((formData as any).categoriesSection?.categories) ||
                      (formData as any).categoriesSection?.categories.length === 0) && (
                        <div className="text-center py-8 text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                          No categories configured. Click &quot;Add Category&quot; above to create one.
                        </div>
                      )}
                  </div>
                </div>

                {/* Bottom Save Action Bar */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                  <div />

                  <button
                    type="button"
                    onClick={handleSaveContent}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-7 py-3 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving Live..." : "Save Category Changes"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: WHAT WE DO SECTION MANAGER (Reliable Surgical Solutions)  */}
            {/* ============================================================== */}
            {activeTab === "what-we-do" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#ED1C24]" />
                      <span>What We Do & Capabilities Manager</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Manage the &quot;Reliable Surgical Solutions for Every Need&quot; section, falling drop letter animations, machining sparks visual, and 4 capability cards.
                    </p>
                  </div>

                  {/* Section Enabled Toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 self-start sm:self-auto hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={(formData as any).whatWeDoSection?.enabled ?? true}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          whatWeDoSection: {
                            ...prev.whatWeDoSection,
                            enabled: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-slate-300 text-[#1B459B] focus:ring-[#1B459B] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      Section Enabled
                    </span>
                  </label>
                </div>

                {/* 1. Header & Heading Texts */}
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#ED1C24]" />
                      <span>Header & Heading Texts (Animated)</span>
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Gravity Drop & Swipe Wave Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Tag / Badge (Falling Letter Physics)
                      </label>
                      <input
                        type="text"
                        value={(formData as any).whatWeDoSection?.tag ?? "WHAT WE DO"}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            whatWeDoSection: {
                              ...prev.whatWeDoSection,
                              tag: e.target.value,
                            },
                          }))
                        }
                        placeholder="WHAT WE DO"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 uppercase tracking-wider focus:outline-none focus:border-[#1B459B]"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Each character falls from above sequentially on scroll & hover.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Title Line 1 (Dark Text)
                      </label>
                      <input
                        type="text"
                        value={(formData as any).whatWeDoSection?.titleLine1 ?? "Reliable Surgical Solutions"}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            whatWeDoSection: {
                              ...prev.whatWeDoSection,
                              titleLine1: e.target.value,
                            },
                          }))
                        }
                        placeholder="Reliable Surgical Solutions"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-900 focus:outline-none focus:border-[#1B459B]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Line 2 Prefix
                        </label>
                        <input
                          type="text"
                          value={(formData as any).whatWeDoSection?.titleLine2Prefix ?? "for "}
                          onChange={(e) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              whatWeDoSection: {
                                ...prev.whatWeDoSection,
                                titleLine2Prefix: e.target.value,
                              },
                            }))
                          }
                          placeholder="for "
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-900 focus:outline-none focus:border-[#1B459B]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Highlight (Grey)
                        </label>
                        <input
                          type="text"
                          value={(formData as any).whatWeDoSection?.titleHighlight ?? "Every Need"}
                          onChange={(e) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              whatWeDoSection: {
                                ...prev.whatWeDoSection,
                                titleHighlight: e.target.value,
                              },
                            }))
                          }
                          placeholder="Every Need"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-500 focus:outline-none focus:border-[#1B459B]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subtitles (Right Side 2 Lines) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200/70">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Subtitle Line 1 (Right Column)
                      </label>
                      <input
                        type="text"
                        value={(formData as any).whatWeDoSection?.subtitleLine1 ?? "Precision manufacturing. Global standards."}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            whatWeDoSection: {
                              ...prev.whatWeDoSection,
                              subtitleLine1: e.target.value,
                            },
                          }))
                        }
                        placeholder="Precision manufacturing. Global standards."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-[#1B459B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Subtitle Line 2 (Right Column)
                      </label>
                      <input
                        type="text"
                        value={(formData as any).whatWeDoSection?.subtitleLine2 ?? "Your trusted partner in surgical excellence."}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            whatWeDoSection: {
                              ...prev.whatWeDoSection,
                              subtitleLine2: e.target.value,
                            },
                          }))
                        }
                        placeholder="Your trusted partner in surgical excellence."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-[#1B459B]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Left Visual Card: Machining Sparks Image & Overlay */}
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#ED1C24]" />
                      <span>Left Visual Card (Machining Sparks Photography)</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                    {/* Visual Preview */}
                    <div className="md:col-span-5 relative aspect-[16/11] rounded-xl overflow-hidden bg-slate-900 border border-slate-300 shadow-inner group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={(formData as any).whatWeDoSection?.leftVisual?.image || "/images/what-we-do/machining-sparks.png"}
                        alt="Machining visual"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 text-white font-bold text-xs">
                        {(formData as any).whatWeDoSection?.leftVisual?.overlayText || "Precision at every stage."}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="md:col-span-7 space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Overlay Text (White Bold text at bottom)
                        </label>
                        <input
                          type="text"
                          value={(formData as any).whatWeDoSection?.leftVisual?.overlayText ?? "Precision at every stage."}
                          onChange={(e) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              whatWeDoSection: {
                                ...prev.whatWeDoSection,
                                leftVisual: {
                                  ...(prev.whatWeDoSection?.leftVisual || {}),
                                  overlayText: e.target.value,
                                },
                              },
                            }))
                          }
                          placeholder="Precision at every stage."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1B459B]"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-600">
                          Upload New Photo or Change Image Path
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer bg-[#1B459B] hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-xs shrink-0">
                            {isUploadingWhatWeDo ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload New Photo</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploadingWhatWeDo}
                              className="hidden"
                              onChange={handleWhatWeDoLeftVisualUpload}
                            />
                          </label>

                          <input
                            type="text"
                            value={(formData as any).whatWeDoSection?.leftVisual?.image ?? ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                whatWeDoSection: {
                                  ...prev.whatWeDoSection,
                                  leftVisual: {
                                    ...(prev.whatWeDoSection?.leftVisual || {}),
                                    image: e.target.value,
                                  },
                                },
                              }))
                            }
                            placeholder="/images/what-we-do/machining-sparks.png"
                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:border-[#1B459B]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Capability / Service Cards (4 Cards) */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#ED1C24]" />
                        <span>Capability &amp; Service Cards (4 Grid Items)</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Add, edit text, choose icon, or remove capability cards freely.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddWhatWeDoCard}
                      className="px-4 py-2 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Capability Card</span>
                    </button>
                  </div>

                  {/* Cards List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {((formData as any).whatWeDoSection?.cards || []).map((card: any, idx: number) => (
                      <div
                        key={card.id || idx}
                        className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative group"
                      >
                        {/* Top row: Number, Icon type, Delete */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-[#ED1C24]">
                              {card.number || `0${idx + 1}`}
                            </span>
                            <input
                              type="text"
                              value={card.number || `0${idx + 1}`}
                              onChange={(e) => handleUpdateWhatWeDoCard(card.id, "number", e.target.value)}
                              placeholder="01"
                              className="w-16 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1B459B]"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Icon selector */}
                            <select
                              value={card.icon || "factory"}
                              onChange={(e) => handleUpdateWhatWeDoCard(card.id, "icon", e.target.value)}
                              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-700 focus:outline-none"
                            >
                              <option value="factory">Factory Chimney</option>
                              <option value="rack">Surgical Instruments Rack</option>
                              <option value="door-shield">Cleanroom Door &amp; Shield</option>
                              <option value="packaging">Packaging &amp; Sterilization</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => handleDeleteWhatWeDoCard(card.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition"
                              title="Delete Card"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Card Title
                          </label>
                          <input
                            type="text"
                            value={card.title || ""}
                            onChange={(e) => handleUpdateWhatWeDoCard(card.id, "title", e.target.value)}
                            placeholder="OEM & Private Label"
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-900 focus:outline-none focus:border-[#1B459B]"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={card.description || ""}
                            onChange={(e) => handleUpdateWhatWeDoCard(card.id, "description", e.target.value)}
                            placeholder="Manufactured to your brand specifications..."
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed focus:outline-none focus:border-[#1B459B]"
                          />
                        </div>

                        {/* Custom Icon upload (Optional) */}
                        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                          <label className="cursor-pointer text-[#1B459B] hover:underline font-bold flex items-center gap-1">
                            {uploadingWhatWeDoCardId === card.id ? (
                              <>
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                <span>Uploading custom icon...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3 h-3" />
                                <span>Upload Custom Icon PNG/SVG</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingWhatWeDoCardId === card.id}
                              className="hidden"
                              onChange={(e) => handleWhatWeDoCardIconUpload(e, card.id)}
                            />
                          </label>

                          {card.customIcon && (
                            <button
                              type="button"
                              onClick={() => handleUpdateWhatWeDoCard(card.id, "customIcon", "")}
                              className="text-red-500 hover:underline text-[10px]"
                            >
                              Reset Icon
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Bottom Action Button */}
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-[#ED1C24]" />
                    <span>Bottom Action Button (&quot;Explore Our Range →&quot;)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={(formData as any).whatWeDoSection?.buttonText ?? "Explore Our Range"}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            whatWeDoSection: {
                              ...prev.whatWeDoSection,
                              buttonText: e.target.value,
                            },
                          }))
                        }
                        placeholder="Explore Our Range"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#1B459B]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Button Destination Link
                      </label>
                      <input
                        type="text"
                        value={(formData as any).whatWeDoSection?.buttonLink ?? "/products"}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            whatWeDoSection: {
                              ...prev.whatWeDoSection,
                              buttonLink: e.target.value,
                            },
                          }))
                        }
                        placeholder="/products"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-[#1B459B]"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Save Action Bar */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                  <div />

                  <button
                    type="button"
                    onClick={handleSaveContent}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-7 py-3 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving Live..." : "Save What We Do Changes"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: FACILITY VIDEO SHOWCASE MANAGER (SS 1)                    */}
            {/* ============================================================== */}
            {activeTab === "video" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <VideoIcon className="w-5 h-5 text-[#ED1C24]" />
                      <span>Facility Video Showcase Manager</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Manage the factory tour video banner, upload video files (.mp4/.webm) or YouTube links, and manage banner poster image.
                    </p>
                  </div>

                  {/* Section Enabled Toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 self-start sm:self-auto hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={(formData as any).videoSection?.enabled ?? true}
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          videoSection: {
                            ...prev.videoSection,
                            enabled: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-slate-300 text-[#1B459B] focus:ring-[#1B459B] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      Section Enabled
                    </span>
                  </label>
                </div>

                {/* 1. Video Upload & Live Placeholder Player */}
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Play className="w-4 h-4 text-[#ED1C24]" />
                      <span>Video File Upload &amp; Live Placeholder Player</span>
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      MP4 / WebM / YouTube Compatible
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Live Video Placeholder Player */}
                    <div className="lg:col-span-6 bg-slate-900 rounded-xl overflow-hidden aspect-video border border-slate-300 shadow-md flex items-center justify-center relative">
                      {(formData as any).videoSection?.videoUrl ? (
                        (formData as any).videoSection?.videoUrl.endsWith(".mp4") ||
                          (formData as any).videoSection?.videoUrl.endsWith(".webm") ||
                          (formData as any).videoSection?.videoUrl.startsWith("/uploads/") ? (
                          <video
                            src={(formData as any).videoSection?.videoUrl}
                            controls
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <iframe
                            src={(formData as any).videoSection?.videoUrl}
                            title="Video Preview"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )
                      ) : (
                        <div className="text-center p-6 text-slate-400">
                          <VideoIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-xs font-bold">No Video Uploaded Yet</p>
                        </div>
                      )}
                    </div>

                    {/* Video Upload Controls */}
                    <div className="lg:col-span-6 space-y-4">
                      {/* Upload Video Button */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                          Upload Video File (.mp4, .webm, .mov)
                        </label>
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer bg-[#ED1C24] hover:bg-[#c9141b] text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-xs">
                            {isUploadingVideoFile ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Uploading Video File...</span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload New Video</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="video/mp4,video/webm,video/ogg,video/quicktime"
                              disabled={isUploadingVideoFile}
                              className="hidden"
                              onChange={handleVideoFileUpload}
                            />
                          </label>

                          <span className="text-[11px] text-slate-400 font-medium">
                            Max upload size: 100MB
                          </span>
                        </div>
                      </div>

                      {/* Video URL Input */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Or Enter Video File Path / YouTube Embed Link:
                        </label>
                        <input
                          type="text"
                          value={(formData as any).videoSection?.videoUrl ?? ""}
                          onChange={(e) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              videoSection: {
                                ...prev.videoSection,
                                videoUrl: e.target.value,
                              },
                            }))
                          }
                          placeholder="/uploads/my-facility-video.mp4 or https://www.youtube.com/embed/..."
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-[#1B459B]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Banner Poster / Visual Graphic */}
                <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#ED1C24]" />
                      <span>Video Banner Poster / Visual (Figma SS 1)</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Visual Preview */}
                    <div className="lg:col-span-6 relative aspect-[16/7] rounded-xl overflow-hidden bg-slate-900 border border-slate-300 shadow-inner group flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={(formData as any).videoSection?.bannerImage || "/images/video/factory-video-banner.png"}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/25 pointer-events-none" />

                      {/* Center Play Button Overlay Preview */}
                      <div className="relative z-10 w-12 h-12 rounded-full bg-white/30 backdrop-blur-xs border-2 border-white flex items-center justify-center text-white shadow-xl">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>

                      {/* Red accent corner */}
                      <div
                        className="absolute top-0 right-0 w-12 h-12 bg-[#ED1C24] pointer-events-none"
                        style={{
                          clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                        }}
                      />
                    </div>

                    {/* Banner Controls */}
                    <div className="lg:col-span-6 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="cursor-pointer bg-[#1B459B] hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-xs">
                          {isUploadingVideoBanner ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading Banner Photo...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Upload Banner Photo</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingVideoBanner}
                            className="hidden"
                            onChange={handleVideoBannerUpload}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev: any) => ({
                              ...prev,
                              videoSection: {
                                ...prev.videoSection,
                                bannerImage: "/images/video/factory-video-banner.png",
                              },
                            }))
                          }
                          className="px-3.5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                          title="Reset to reference banner"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset Default</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Or Enter Image Path Directly:
                        </label>
                        <input
                          type="text"
                          value={(formData as any).videoSection?.bannerImage ?? ""}
                          onChange={(e) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              videoSection: {
                                ...prev.videoSection,
                                bannerImage: e.target.value,
                              },
                            }))
                          }
                          placeholder="/images/video/factory-video-banner.png"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-[#1B459B]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Save Action Bar */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                  <div />

                  <button
                    type="button"
                    onClick={handleSaveContent}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-7 py-3 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving Live..." : "Save Video Changes"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: ADVANCED SOLUTIONS & INQUIRY (SS 2)                       */}
            {/* ============================================================== */}
            {activeTab === "solutions" && (
              <div className="space-y-8">
                {/* Section Header with Live Toggle & Save */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-[#ED1C24] animate-pulse" />
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Advanced Solutions & Inquiry Manager
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Manage top banner, 4 capability cards, and the inquiry dark talk banner live. All updates persist permanently to the database.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          advancedSolutionsSection: {
                            ...(prev as any).advancedSolutionsSection,
                            enabled: !(prev as any).advancedSolutionsSection?.enabled,
                          },
                        }))
                      }
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${(formData as any)?.advancedSolutionsSection?.enabled !== false
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${(formData as any)?.advancedSolutionsSection?.enabled !== false
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                          }`}
                      />
                      <span>
                        {(formData as any)?.advancedSolutionsSection?.enabled !== false
                          ? "Live on Website"
                          : "Hidden on Website"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveContent}
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-xl text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                </div>

                {/* ------------------------------------------------------------ */}
                {/* 1. TOP BANNER: ADVANCED MEDICAL PRODUCT SOLUTIONS            */}
                {/* ------------------------------------------------------------ */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="border-b border-slate-200 pb-3 flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-[#ED1C24]" />
                    <h3 className="text-lg font-black text-slate-900">
                      1. Top Banner (Advanced Medical Product Solutions)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Tag / Badge (Letter-by-Letter Falling)
                      </label>
                      <input
                        type="text"
                        value={
                          (formData as any)?.advancedSolutionsSection?.tag ??
                          "PRECISION. QUALITY. TRUST"
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            advancedSolutionsSection: {
                              ...(prev as any).advancedSolutionsSection,
                              tag: e.target.value,
                            },
                          }))
                        }
                        placeholder="PRECISION. QUALITY. TRUST"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 focus:border-[#1B459B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Heading Line 1 (Navy / Dark Text)
                      </label>
                      <input
                        type="text"
                        value={
                          (formData as any)?.advancedSolutionsSection?.titleLine1 ??
                          "ADVANCED MEDICAL"
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            advancedSolutionsSection: {
                              ...(prev as any).advancedSolutionsSection,
                              titleLine1: e.target.value,
                            },
                          }))
                        }
                        placeholder="ADVANCED MEDICAL"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 focus:border-[#1B459B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Heading Highlight (Red Text)
                      </label>
                      <input
                        type="text"
                        value={
                          (formData as any)?.advancedSolutionsSection?.titleHighlight ??
                          "PRODUCT SOLUTIONS."
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            advancedSolutionsSection: {
                              ...(prev as any).advancedSolutionsSection,
                              titleHighlight: e.target.value,
                            },
                          }))
                        }
                        placeholder="PRODUCT SOLUTIONS."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#ED1C24] focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#ED1C24]"
                      />
                    </div>
                  </div>

                  {/* Paragraph 1 and 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Lead Paragraph 1 (Materials & Specifications)
                      </label>
                      <textarea
                        rows={3}
                        value={
                          (formData as any)?.advancedSolutionsSection?.paragraph1 ??
                          "We Manufacture Premium Surgical & Dental Instruments For OEM, Private Label, And Sterile Kitting, Using High-Grade German & Japanese Stainless Steel To Meet DIN And ISO/ASTM Standards."
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            advancedSolutionsSection: {
                              ...(prev as any).advancedSolutionsSection,
                              paragraph1: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 focus:border-[#1B459B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Lead Paragraph 2 (Options & Kitting)
                      </label>
                      <textarea
                        rows={3}
                        value={
                          (formData as any)?.advancedSolutionsSection?.paragraph2 ??
                          "Available In Reusable, Single-Use, And EO-Sterilized Options."
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            advancedSolutionsSection: {
                              ...(prev as any).advancedSolutionsSection,
                              paragraph2: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 focus:border-[#1B459B]"
                      />
                    </div>
                  </div>

                  {/* Button Texts & Link */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={
                          (formData as any)?.advancedSolutionsSection?.buttonText ??
                          "EXPLORE OUR PRODUCTS"
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            advancedSolutionsSection: {
                              ...(prev as any).advancedSolutionsSection,
                              buttonText: e.target.value,
                            },
                          }))
                        }
                        placeholder="EXPLORE OUR PRODUCTS"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 focus:border-[#1B459B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Button Link URL
                      </label>
                      <input
                        type="text"
                        value={
                          (formData as any)?.advancedSolutionsSection?.buttonLink ??
                          "/products"
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            advancedSolutionsSection: {
                              ...(prev as any).advancedSolutionsSection,
                              buttonLink: e.target.value,
                            },
                          }))
                        }
                        placeholder="/products"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 focus:border-[#1B459B]"
                      />
                    </div>
                  </div>

                  {/* Surgeon Photo / Banner Graphic Upload */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Surgeon Hands / Right Showcase Image
                    </label>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative w-36 h-24 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0 shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            (formData as any)?.advancedSolutionsSection?.bannerImage ||
                            "/images/products-showcase/surgeon-gloves-instruments.png"
                          }
                          alt="Surgeon Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <div className="flex items-center gap-3">
                          <label className="cursor-pointer px-4 py-2 bg-[#1B459B] hover:bg-[#153477] text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            <span>
                              {isUploadingSolutionsBanner
                                ? "Uploading..."
                                : "Upload New Image"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploadingSolutionsBanner}
                              onChange={handleSolutionsBannerUpload}
                            />
                          </label>

                          <span className="text-[11px] text-slate-500">
                            Recommended: High-res photo (.png / .jpg / .webp)
                          </span>
                        </div>

                        <input
                          type="text"
                          value={
                            (formData as any)?.advancedSolutionsSection?.bannerImage ??
                            "/images/products-showcase/surgeon-gloves-instruments.png"
                          }
                          onChange={(e) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              advancedSolutionsSection: {
                                ...(prev as any).advancedSolutionsSection,
                                bannerImage: e.target.value,
                              },
                            }))
                          }
                          placeholder="/images/products-showcase/surgeon-gloves-instruments.png"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1B459B]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------------------ */}
                {/* 2. MIDDLE CAPABILITIES CARDS (Built To Perform / Made To Last) */}
                {/* ------------------------------------------------------------ */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-5 h-5 text-[#1B459B]" />
                      <h3 className="text-lg font-black text-slate-900">
                        2. Capabilities Section (Built To Perform / Made To Last)
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSolutionsCard}
                      className="px-4 py-2 bg-slate-100 hover:bg-[#1B459B] text-slate-700 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Card</span>
                    </button>
                  </div>

                  {/* Section Title & Tag */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Section Tag (Falling Letter Animation)
                      </label>
                      <input
                        type="text"
                        value={
                          (formData as any)?.advancedSolutionsSection?.capabilitiesTag ??
                          "BUILT TO PERFORM"
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            advancedSolutionsSection: {
                              ...(prev as any).advancedSolutionsSection,
                              capabilitiesTag: e.target.value,
                            },
                          }))
                        }
                        placeholder="BUILT TO PERFORM"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 focus:border-[#1B459B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Section Heading (Character Swipe Wave)
                      </label>
                      <input
                        type="text"
                        value={
                          (formData as any)?.advancedSolutionsSection?.capabilitiesTitle ??
                          "MADE TO LAST."
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            advancedSolutionsSection: {
                              ...(prev as any).advancedSolutionsSection,
                              capabilitiesTitle: e.target.value,
                            },
                          }))
                        }
                        placeholder="MADE TO LAST."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 focus:border-[#1B459B]"
                      />
                    </div>
                  </div>

                  {/* Cards Editor Grid */}
                  <div className="space-y-4 pt-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Elevated Cards List ({(formData as any)?.advancedSolutionsSection?.capabilitiesCards?.length || 4} Cards)
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {((formData as any)?.advancedSolutionsSection?.capabilitiesCards || []).map(
                        (card: any, idx: number) => (
                          <div
                            key={card.id || idx}
                            className="bg-slate-50 p-5 rounded-xl border border-slate-200/90 space-y-4 relative group"
                          >
                            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                              <span className="text-xs font-mono font-bold text-[#1B459B] uppercase">
                                Card #{idx + 1} &bull; {card.title}
                              </span>

                              <button
                                type="button"
                                onClick={() => handleDeleteSolutionsCard(card.id)}
                                className="text-slate-400 hover:text-red-600 p-1 rounded-md transition"
                                title="Delete Card"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Icon & Title */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                  Icon Type
                                </label>
                                <select
                                  value={card.icon || "book"}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      advancedSolutionsSection: {
                                        ...(prev as any).advancedSolutionsSection,
                                        capabilitiesCards: (
                                          (prev as any).advancedSolutionsSection?.capabilitiesCards || []
                                        ).map((c: any) =>
                                          c.id === card.id ? { ...c, icon: val } : c
                                        ),
                                      },
                                    }));
                                  }}
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1B459B]"
                                >
                                  <option value="book">Book / Catalogs (BookOpen)</option>
                                  <option value="shield">Quality Standards (ShieldCheck)</option>
                                  <option value="building">OEM / Private Label (Building2)</option>
                                  <option value="layers">Materials & Sterilization (Layers)</option>
                                  <option value="boxes">Packaging / General (Boxes)</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                  Card Title
                                </label>
                                <input
                                  type="text"
                                  value={card.title}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      advancedSolutionsSection: {
                                        ...(prev as any).advancedSolutionsSection,
                                        capabilitiesCards: (
                                          (prev as any).advancedSolutionsSection?.capabilitiesCards || []
                                        ).map((c: any) =>
                                          c.id === card.id ? { ...c, title: val } : c
                                        ),
                                      },
                                    }));
                                  }}
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B459B]"
                                />
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                Description
                              </label>
                              <textarea
                                rows={2}
                                value={card.description}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormData((prev: any) => ({
                                    ...prev,
                                    advancedSolutionsSection: {
                                      ...(prev as any).advancedSolutionsSection,
                                      capabilitiesCards: (
                                        (prev as any).advancedSolutionsSection?.capabilitiesCards || []
                                      ).map((c: any) =>
                                        c.id === card.id ? { ...c, description: val } : c
                                      ),
                                    },
                                  }));
                                }}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#1B459B]"
                              />
                            </div>

                            {/* Direct Catalog PDF / Document Upload */}
                            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5 text-[#1B459B]" />
                                  <span>Catalog PDF / Document Upload</span>
                                </label>
                                {card.linkUrl && (card.linkUrl.endsWith('.pdf') || card.linkUrl.startsWith('/uploads/')) && (
                                  <a
                                    href={card.linkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold text-[#1B459B] hover:underline flex items-center gap-1"
                                  >
                                    <span>Test / Open ↗</span>
                                  </a>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <label className="cursor-pointer px-3 py-1.5 bg-[#1B459B] hover:bg-[#153477] text-white rounded-md text-[11px] font-bold transition flex items-center gap-1.5 shadow-xs">
                                  <Upload className="w-3 h-3" />
                                  <span>
                                    {isUploadingCatalogCardId === card.id
                                      ? "Uploading..."
                                      : "Upload Catalog (PDF / Doc)"}
                                  </span>
                                  <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.zip"
                                    className="hidden"
                                    disabled={isUploadingCatalogCardId === card.id}
                                    onChange={(e) => handleCardCatalogUpload(e, card.id)}
                                  />
                                </label>

                                <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
                                  {card.linkUrl && card.linkUrl.startsWith('/uploads/')
                                    ? "✓ Attached: " + (card.catalogFileName || card.linkUrl.split('/').pop())
                                    : "No catalog file attached (link will route to URL)"}
                                </span>
                              </div>
                            </div>

                            {/* Link Text & URL */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                  Link Label
                                </label>
                                <input
                                  type="text"
                                  value={card.linkText || "View Catalogs"}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      advancedSolutionsSection: {
                                        ...(prev as any).advancedSolutionsSection,
                                        capabilitiesCards: (
                                          (prev as any).advancedSolutionsSection?.capabilitiesCards || []
                                        ).map((c: any) =>
                                          c.id === card.id ? { ...c, linkText: val } : c
                                        ),
                                      },
                                    }));
                                  }}
                                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1B459B]"
                                />
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                                  Link URL
                                </label>
                                <input
                                  type="text"
                                  value={card.linkUrl || "/catalog"}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      advancedSolutionsSection: {
                                        ...(prev as any).advancedSolutionsSection,
                                        capabilitiesCards: (
                                          (prev as any).advancedSolutionsSection?.capabilitiesCards || []
                                        ).map((c: any) =>
                                          c.id === card.id ? { ...c, linkUrl: val } : c
                                        ),
                                      },
                                    }));
                                  }}
                                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#1B459B]"
                                />
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* ------------------------------------------------------------ */}
                {/* 3. BOTTOM DARK TALK BANNER (Let's Talk About Your Instrument) */}
                {/* ------------------------------------------------------------ */}
                <div className="bg-[#182333] text-white rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
                  <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-5 h-5 text-[#ED1C24]" />
                      <h3 className="text-lg font-black text-white">
                        3. Bottom Dark Inquiry Banner (Let&apos;s Talk About Your Instrument)
                      </h3>
                    </div>

                    <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800">
                      Heavy-Duty Luminous Physics Active
                    </span>
                  </div>

                  {/* Title Lines */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Title Line 1
                      </label>
                      <input
                        type="text"
                        value={
                          (formData as any)?.advancedSolutionsSection?.talkTitleLine1 ??
                          "Let's Talk About"
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            advancedSolutionsSection: {
                              ...(prev as any).advancedSolutionsSection,
                              talkTitleLine1: e.target.value,
                            },
                          }))
                        }
                        placeholder="Let's Talk About"
                        className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Title Line 2
                      </label>
                      <input
                        type="text"
                        value={
                          (formData as any)?.advancedSolutionsSection?.talkTitleLine2 ??
                          "Your Instrument."
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            advancedSolutionsSection: {
                              ...(prev as any).advancedSolutionsSection,
                              talkTitleLine2: e.target.value,
                            },
                          }))
                        }
                        placeholder="Your Instrument."
                        className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-[#ED1C24]"
                      />
                    </div>
                  </div>

                  {/* Luminous Talk Paragraph */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Inquiry Lead Paragraph (Heavy-Duty Interactive Animation)
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Animated word-by-word with blur focus and luminous cyan hover
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={
                        (formData as any)?.advancedSolutionsSection?.talkParagraph ??
                        "Whether Product Advice, Partnership Or A Visit To Our Production, We Look Forward To Hearing From You And Will Get Back To You Promptly."
                      }
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          advancedSolutionsSection: {
                            ...(prev as any).advancedSolutionsSection,
                            talkParagraph: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm font-normal text-slate-200 leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                        Primary Button Text (Red Pill)
                      </label>
                      <input
                        type="text"
                        value={
                          (formData as any)?.advancedSolutionsSection?.primaryBtnText ??
                          "GET IN TOUCH"
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            advancedSolutionsSection: {
                              ...(prev as any).advancedSolutionsSection,
                              primaryBtnText: e.target.value,
                            },
                          }))
                        }
                        placeholder="GET IN TOUCH"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                        Primary Button Link
                      </label>
                      <input
                        type="text"
                        value={
                          (formData as any)?.advancedSolutionsSection?.primaryBtnLink ??
                          "/contact"
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            advancedSolutionsSection: {
                              ...(prev as any).advancedSolutionsSection,
                              primaryBtnLink: e.target.value,
                            },
                          }))
                        }
                        placeholder="/contact"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                        Secondary Button Text (Red Outline)
                      </label>
                      <input
                        type="text"
                        value={
                          (formData as any)?.advancedSolutionsSection?.secondaryBtnText ??
                          "DOWNLOAD CATALOGUE"
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            advancedSolutionsSection: {
                              ...(prev as any).advancedSolutionsSection,
                              secondaryBtnText: e.target.value,
                            },
                          }))
                        }
                        placeholder="DOWNLOAD CATALOGUE"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                        Secondary Button Link
                      </label>
                      <input
                        type="text"
                        value={
                          (formData as any)?.advancedSolutionsSection?.secondaryBtnLink ??
                          "/catalog"
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            advancedSolutionsSection: {
                              ...(prev as any).advancedSolutionsSection,
                              secondaryBtnLink: e.target.value,
                            },
                          }))
                        }
                        placeholder="/catalog"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Save Action Bar */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                  <div />

                  <button
                    type="button"
                    onClick={handleSaveContent}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-7 py-3 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving Live..." : "Save Solutions Changes"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: GLOBAL STANDARDS & EXPORTS (SS 2)                         */}
            {/* ============================================================== */}
            {activeTab === "standards" && (
              <div className="space-y-8">
                {/* Section Header with Live Toggle & Save */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-[#ED1C24] animate-pulse" />
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Global Compliances & Exports Manager
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Manage our compliances, customized tools, upcoming activities, and worldwide export destinations live.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev: any) => ({
                          ...prev,
                          globalStandardsSection: {
                            ...(prev as any).globalStandardsSection,
                            enabled: !(prev as any).globalStandardsSection?.enabled,
                          },
                        }))
                      }
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${(formData as any)?.globalStandardsSection?.enabled !== false
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${(formData as any)?.globalStandardsSection?.enabled !== false
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                          }`}
                      />
                      <span>
                        {(formData as any)?.globalStandardsSection?.enabled !== false
                          ? "Live on Website"
                          : "Hidden on Website"}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveContent}
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-xl text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                    </button>
                  </div>
                </div>

                {/* 1. OUR COMPLIANCES */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="border-b border-slate-200 pb-3 flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-[#1B459B]" />
                    <h3 className="text-lg font-black text-slate-900">
                      1. Compliances & Certifications (Global Standards. Trusted Quality.)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Tag / Badge (Falling Letters Drop)
                      </label>
                      <input
                        type="text"
                        value={(formData as any)?.globalStandardsSection?.compTag ?? "OUR COMPLIANCES"}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            globalStandardsSection: {
                              ...(prev as any).globalStandardsSection,
                              compTag: e.target.value,
                            },
                          }))
                        }
                        placeholder="OUR COMPLIANCES"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 focus:border-[#1B459B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Heading Line 1
                      </label>
                      <input
                        type="text"
                        value={(formData as any)?.globalStandardsSection?.compTitleLine1 ?? "Global Standards."}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            globalStandardsSection: {
                              ...(prev as any).globalStandardsSection,
                              compTitleLine1: e.target.value,
                            },
                          }))
                        }
                        placeholder="Global Standards."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 focus:border-[#1B459B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Heading Highlight (Red Text)
                      </label>
                      <input
                        type="text"
                        value={(formData as any)?.globalStandardsSection?.compTitleHighlight ?? "Trusted Quality."}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            globalStandardsSection: {
                              ...(prev as any).globalStandardsSection,
                              compTitleHighlight: e.target.value,
                            },
                          }))
                        }
                        placeholder="Trusted Quality."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#ED1C24] focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#ED1C24]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Side Paragraph (Heavy-Duty Luminous Animated)
                    </label>
                    <textarea
                      rows={2}
                      value={
                        (formData as any)?.globalStandardsSection?.compParagraph ??
                        "We follow internationally recognized standards to ensure safety, quality and reliability in every product we deliver."
                      }
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          globalStandardsSection: {
                            ...(prev as any).globalStandardsSection,
                            compParagraph: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 focus:border-[#1B459B]"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-36 h-24 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0 shadow-sm">
                      <img
                        src={
                          (formData as any)?.globalStandardsSection?.compImage ||
                          "/images/global-standards/compliances-surgeon-hands.png"
                        }
                        alt="Surgeon Hands Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Surgeon Hands & Tray Photo
                      </label>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#1B459B] hover:bg-[#153477] text-white rounded-lg text-xs font-bold transition shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingCompImage ? "Uploading..." : "Upload New Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploadingCompImage}
                          onChange={handleCompImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 2. CUSTOM TOOLS & UPCOMING ACTIVITIES */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                  {/* Left: Customized Tools */}
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
                    <div className="border-b border-slate-200 pb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#ED1C24]" />
                      <h4 className="text-base font-black text-slate-900">
                        2A. Customized Tools Card
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Tag
                        </label>
                        <input
                          type="text"
                          value={(formData as any)?.globalStandardsSection?.toolsTag ?? "OUR HEALTH CARE"}
                          onChange={(e) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              globalStandardsSection: {
                                ...(prev as any).globalStandardsSection,
                                toolsTag: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Title Line 1
                        </label>
                        <input
                          type="text"
                          value={(formData as any)?.globalStandardsSection?.toolsTitleLine1 ?? "Are you ready to get"}
                          onChange={(e) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              globalStandardsSection: {
                                ...(prev as any).globalStandardsSection,
                                toolsTitleLine1: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Title Highlight (Red)
                        </label>
                        <input
                          type="text"
                          value={(formData as any)?.globalStandardsSection?.toolsTitleHighlight ?? "customized tools?"}
                          onChange={(e) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              globalStandardsSection: {
                                ...(prev as any).globalStandardsSection,
                                toolsTitleHighlight: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-[#ED1C24]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={(formData as any)?.globalStandardsSection?.toolsBtnText ?? "Contact Now"}
                          onChange={(e) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              globalStandardsSection: {
                                ...(prev as any).globalStandardsSection,
                                toolsBtnText: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Side Paragraph
                      </label>
                      <textarea
                        rows={2}
                        value={
                          (formData as any)?.globalStandardsSection?.toolsParagraph ??
                          "We offer tailored surgical instruments to meet your specific needs and requirements."
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            globalStandardsSection: {
                              ...(prev as any).globalStandardsSection,
                              toolsParagraph: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    {/* Tools Tray Image Upload */}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="w-20 h-16 rounded-lg bg-slate-200 overflow-hidden border shrink-0">
                        <img
                          src={
                            (formData as any)?.globalStandardsSection?.toolsImage ||
                            "/images/global-standards/customized-tools-tray.png"
                          }
                          alt="Tools Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <label className="cursor-pointer px-3.5 py-1.5 bg-[#1B459B] hover:bg-[#153477] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingToolsImage ? "Uploading..." : "Upload Tools Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploadingToolsImage}
                          onChange={handleToolsImageUpload}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Right: Upcoming Activities */}
                  <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
                    <div className="border-b border-slate-200 pb-3 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#ED1C24]" />
                      <h4 className="text-base font-black text-slate-900">
                        2B. Upcoming Activities Card
                      </h4>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Title Line 1
                      </label>
                      <input
                        type="text"
                        value={(formData as any)?.globalStandardsSection?.eventsTitleLine1 ?? "Stay Updated with Our"}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            globalStandardsSection: {
                              ...(prev as any).globalStandardsSection,
                              eventsTitleLine1: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Title Highlight (Red)
                      </label>
                      <input
                        type="text"
                        value={(formData as any)?.globalStandardsSection?.eventsTitleHighlight ?? "Upcoming Activities"}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            globalStandardsSection: {
                              ...(prev as any).globalStandardsSection,
                              eventsTitleHighlight: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-[#ED1C24]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Side Paragraph
                      </label>
                      <textarea
                        rows={2}
                        value={
                          (formData as any)?.globalStandardsSection?.eventsParagraph ??
                          "Be the first to know about new launches, exhibitions, and latest updates."
                        }
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            globalStandardsSection: {
                              ...(prev as any).globalStandardsSection,
                              eventsParagraph: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={(formData as any)?.globalStandardsSection?.eventsBtnText ?? "View Events"}
                          onChange={(e) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              globalStandardsSection: {
                                ...(prev as any).globalStandardsSection,
                                eventsBtnText: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Button Link
                        </label>
                        <input
                          type="text"
                          value={(formData as any)?.globalStandardsSection?.eventsBtnLink ?? "/events"}
                          onChange={(e) =>
                            setFormData((prev: any) => ({
                              ...prev,
                              globalStandardsSection: {
                                ...(prev as any).globalStandardsSection,
                                eventsBtnLink: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. EXPORT DESTINATIONS */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="border-b border-slate-200 pb-3 flex items-center gap-2.5">
                    <Globe2 className="w-5 h-5 text-[#1B459B]" />
                    <h3 className="text-lg font-black text-slate-900">
                      3. Worldwide Network & Export Destinations
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Tag (Falling Letters)
                      </label>
                      <input
                        type="text"
                        value={(formData as any)?.globalStandardsSection?.exportTag ?? "EXPORT DESTINATIONS"}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            globalStandardsSection: {
                              ...(prev as any).globalStandardsSection,
                              exportTag: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Title Line 1 & Line 2
                      </label>
                      <input
                        type="text"
                        value={(formData as any)?.globalStandardsSection?.exportTitleLine1 ?? "Trusted Worldwide"}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            globalStandardsSection: {
                              ...(prev as any).globalStandardsSection,
                              exportTitleLine1: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Title Highlight (Red)
                      </label>
                      <input
                        type="text"
                        value={(formData as any)?.globalStandardsSection?.exportTitleHighlight ?? "to Your Market"}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            globalStandardsSection: {
                              ...(prev as any).globalStandardsSection,
                              exportTitleHighlight: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-[#ED1C24]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Side Paragraph (Heavy Luminous Reveal)
                    </label>
                    <textarea
                      rows={2}
                      value={
                        (formData as any)?.globalStandardsSection?.exportParagraph ??
                        "We export high-quality surgical instruments to countries across the globe, ensuring reliable supply and lasting partnerships."
                      }
                      onChange={(e) =>
                        setFormData((prev: any) => ({
                          ...prev,
                          globalStandardsSection: {
                            ...(prev as any).globalStandardsSection,
                            exportParagraph: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Stat 1 Value
                      </label>
                      <input
                        type="text"
                        value={(formData as any)?.globalStandardsSection?.exportStat1Number ?? "250+"}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            globalStandardsSection: {
                              ...(prev as any).globalStandardsSection,
                              exportStat1Number: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Stat 1 Label
                      </label>
                      <input
                        type="text"
                        value={(formData as any)?.globalStandardsSection?.exportStat1Label ?? "Qualified Staff"}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            globalStandardsSection: {
                              ...(prev as any).globalStandardsSection,
                              exportStat1Label: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Stat 2 Value
                      </label>
                      <input
                        type="text"
                        value={(formData as any)?.globalStandardsSection?.exportStat2Number ?? "10000+"}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            globalStandardsSection: {
                              ...(prev as any).globalStandardsSection,
                              exportStat2Number: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-[#ED1C24]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Stat 2 Label
                      </label>
                      <input
                        type="text"
                        value={(formData as any)?.globalStandardsSection?.exportStat2Label ?? "Instruments"}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            globalStandardsSection: {
                              ...(prev as any).globalStandardsSection,
                              exportStat2Label: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* 3D Globe Upload */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-36 h-28 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 shrink-0 shadow-sm flex items-center justify-center">
                      <img
                        src={
                          (formData as any)?.globalStandardsSection?.exportGlobeImage ||
                          "/images/global-standards/worldwide-globe-network.png"
                        }
                        alt="Globe Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        3D Globe Graphic with Country Pins & Flights
                      </label>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#1B459B] hover:bg-[#153477] text-white rounded-lg text-xs font-bold transition shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploadingGlobeImage ? "Uploading..." : "Upload New Globe Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploadingGlobeImage}
                          onChange={handleGlobeImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bottom Save Action Bar */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                  <div />

                  <button
                    type="button"
                    onClick={handleSaveContent}
                    disabled={isSaving}
                    className="w-full sm:w-auto px-7 py-3 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving Live..." : "Save Standards Changes"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 2: PRODUCTS CATALOG MANAGER                                */}
            {/* ============================================================== */}
            {activeTab === "products" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 w-full max-w-full min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Products Catalog Manager
                    </h2>
                    <p className="text-xs text-slate-500">
                      Add, edit, or delete products live. Changes appear immediately on the website
                      and across all devices.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const allCats = getBaseCategories(formData);
                      const firstCat = allCats[0]?.slug || allCats[0]?.id || "general-instrumentation";
                      const firstSub = allCats[0]?.subcategories?.[0] || "";
                      const newCode = "ET-" + Math.floor(100 + Math.random() * 900);
                      setEditingProduct(null);
                      setProductForm({
                        code: newCode,
                        name: "",
                        category: firstCat,
                        subcategory: firstSub,
                        description: "",
                        image: "",
                        gallery: [],
                        isFeatured: true,
                        material: "",
                        stock: "In Stock",
                      });
                      setSizeOptionsText("");
                      setCustomSpecsList([]);
                      setSizesTableList([
                        {
                          article_number: newCode,
                          pattern: "",
                          cup_size: "Standard",
                          length: "",
                        },
                      ]);
                      setProductModalOpen(true);
                    }}
                    className="px-4 py-2.5 bg-[#1B459B] hover:bg-[#13326f] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>

                {/* Search & Pagination Bar */}
                {(() => {
                  const q = adminProductSearch.trim().toLowerCase();
                  const filteredAdminProducts = q
                    ? products.filter(
                        (p) =>
                          (p.name || "").toLowerCase().includes(q) ||
                          (p.code || "").toLowerCase().includes(q) ||
                          (p.category || "").toLowerCase().includes(q) ||
                          (p.subcategory || "").toLowerCase().includes(q)
                      )
                    : products;
                  const totalPages = Math.max(1, Math.ceil(filteredAdminProducts.length / ADMIN_PRODUCTS_PER_PAGE));
                  const safePage = Math.min(adminProductPage, totalPages);
                  const paginatedProducts = filteredAdminProducts.slice(
                    (safePage - 1) * ADMIN_PRODUCTS_PER_PAGE,
                    safePage * ADMIN_PRODUCTS_PER_PAGE
                  );

                  return (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
                        <div className="relative w-full sm:w-80">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="Search products by name, code, category..."
                            value={adminProductSearch}
                            onChange={(e) => {
                              setAdminProductSearch(e.target.value);
                              setAdminProductPage(1);
                            }}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20"
                          />
                        </div>
                        <div className="text-xs font-semibold text-slate-500">
                          Showing {filteredAdminProducts.length === 0 ? 0 : (safePage - 1) * ADMIN_PRODUCTS_PER_PAGE + 1}
                          –{Math.min(safePage * ADMIN_PRODUCTS_PER_PAGE, filteredAdminProducts.length)} of {filteredAdminProducts.length} products
                        </div>
                      </div>

                {/* Products Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                        <th className="py-3 px-4">Image</th>
                        <th className="py-3 px-4">Code / SKU</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Featured</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paginatedProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="py-2.5 px-4">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 p-1 flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={p.image}
                                alt={p.name}
                                loading="lazy"
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-[#ED1C24]">
                            {p.code}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-slate-900">
                            {p.name}
                          </td>
                          <td className="py-2.5 px-4 text-slate-600 uppercase text-[10px] font-semibold">
                            {p.category}
                          </td>
                          <td className="py-2.5 px-4">
                            {p.isFeatured ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                                Featured
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">Standard</span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-right space-x-2">
                            <Link
                              href={`/products/${p.slug || p.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 hover:bg-slate-200 rounded text-slate-600 hover:text-emerald-600 transition inline-block align-middle"
                              title="Open Product Large View Page (Screenshot 4 & 5)"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductForm(p);
                                const initialSizeText = p.size_options && Array.isArray(p.size_options) && p.size_options.length > 0
                                  ? p.size_options.join(", ")
                                  : (p.cup_size || "");
                                setSizeOptionsText(initialSizeText);

                                const existingSpecs = p.specs && Array.isArray(p.specs)
                                  ? p.specs
                                  : [];
                                setCustomSpecsList(existingSpecs);

                                const existingSizesTable = (p as any).sizes_table && Array.isArray((p as any).sizes_table)
                                  ? (p as any).sizes_table
                                  : [];
                                setSizesTableList(existingSizesTable);

                                setProductModalOpen(true);
                              }}
                              className="p-1.5 hover:bg-slate-200 rounded text-slate-600 hover:text-[#1B459B] transition inline-block align-middle"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 hover:bg-red-100 rounded text-slate-600 hover:text-red-600 transition inline-block align-middle"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                      {/* Pagination Controls (SS 2 style) */}
                      <div className="pt-4 border-t border-slate-200 flex items-center justify-center gap-3 text-xs font-semibold text-slate-700 select-none">
                        <button
                          type="button"
                          onClick={() => setAdminProductPage(1)}
                          disabled={safePage <= 1}
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition"
                          title="First Page"
                        >
                          &laquo;
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdminProductPage((p) => Math.max(1, p - 1))}
                          disabled={safePage <= 1}
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition"
                          title="Previous Page"
                        >
                          &lsaquo;
                        </button>
                        <span className="px-2 text-slate-700">
                          Page <strong className="text-slate-900">{safePage}</strong> of{" "}
                          <strong className="text-slate-900">{totalPages}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setAdminProductPage((p) => Math.min(totalPages, p + 1))}
                          disabled={safePage >= totalPages}
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition"
                          title="Next Page"
                        >
                          &rsaquo;
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdminProductPage(totalPages)}
                          disabled={safePage >= totalPages}
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition"
                          title="Last Page"
                        >
                          &raquo;
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: PRODUCT PAGE & MEGA MENU (SS 2 MATCH)                     */}
            {/* ============================================================== */}
            {activeTab === "product-page" && (
              <div className="space-y-6 w-full max-w-full min-w-0 overflow-hidden">

                {/* Header Banner */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Grid className="w-5 h-5 text-[#1B459B]" />
                      <span>Product Page &amp; Categories Manager</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Customize the top showcase banner, category titles, 33 sub-categories, and inquiries box. Changes apply live to the /products page!
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveContent}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-[#1B459B] hover:bg-[#13326f] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-sm shrink-0"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>

                {/* 1. TOP BANNER SHOWCASE CONFIGURATION (SS 2) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        1. Top Showcase Banner (Screenshot 2 Match)
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Top banner displayed on the Products page and inside the Navbar Mega Menu preview.
                      </p>
                    </div>
                  </div>

                  {/* Live Visual Preview of Banner */}
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 max-w-lg">
                      <div className="text-[11px] font-semibold text-slate-500">
                        home / {((formData as any).productPage?.categories || [])[selectedAdminCatIdx]?.name || "General instrumentation"} / Scalpels
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                        {(formData as any).productPage?.bannerTitleLine1 || "RELIABLE HEALTHCARE PRODUCTS."}
                        <br />
                        <span className="text-[#ED1C24]">
                          {(formData as any).productPage?.bannerTitleHighlight || "ADVANCED SOLUTIONS."}
                        </span>
                      </h4>
                    </div>

                    <div className="relative rounded-xl overflow-hidden aspect-[16/10] w-64 bg-slate-200 border border-slate-300 shadow-sm shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={(formData as any).productPage?.bannerImage || "/images/global-standards/compliances-surgeon-hands.png"}
                        alt="Product Showcase Banner"
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute bottom-0 right-0 w-16 h-12 bg-[#ED1C24] pointer-events-none"
                        style={{ clipPath: "polygon(35% 0, 100% 0, 100% 100%, 0 100%)" }}
                      />
                    </div>
                  </div>

                  {/* Banner Form Controls */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Banner Headline Line 1
                      </label>
                      <input
                        type="text"
                        value={(formData as any).productPage?.bannerTitleLine1 || ""}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            productPage: {
                              ...((prev as any).productPage || {}),
                              bannerTitleLine1: e.target.value,
                            },
                          }))
                        }
                        placeholder="RELIABLE HEALTHCARE PRODUCTS."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Banner Headline Highlight (Red Accent)
                      </label>
                      <input
                        type="text"
                        value={(formData as any).productPage?.bannerTitleHighlight || ""}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            productPage: {
                              ...((prev as any).productPage || {}),
                              bannerTitleHighlight: e.target.value,
                            },
                          }))
                        }
                        placeholder="ADVANCED SOLUTIONS."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#ED1C24] focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20"
                      />
                    </div>
                  </div>

                  {/* Banner Image Upload (Fast < 200ms) */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Banner Image (Right Scissor & Surgeon Hand)
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="text"
                        value={(formData as any).productPage?.bannerImage || ""}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            productPage: {
                              ...((prev as any).productPage || {}),
                              bannerImage: e.target.value,
                            },
                          }))
                        }
                        placeholder="/images/global-standards/compliances-surgeon-hands.png"
                        className="flex-1 px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20"
                      />

                      <label className="px-5 py-2.5 bg-[#1B459B] hover:bg-[#13326f] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0">
                        <Upload className="w-4 h-4" />
                        <span>{isUploadingProductPageBanner ? "Uploading (Fast)..." : "Upload Image Fast"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductPageBannerUpload}
                          disabled={isUploadingProductPageBanner}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* ============================================================== */}
                {/* 2. CATEGORIES & SUB-CATEGORIES DIRECTORY (SS 2 & 3 MATCH)       */}
                {/* ============================================================== */}
                {(() => {
                  const cats = getBaseCategories(formData);
                  const safeIdx = selectedAdminCatIdx < cats.length ? selectedAdminCatIdx : 0;
                  const activeCat = cats[safeIdx] || cats[0] || DEFAULT_ADMIN_PRODUCT_CATEGORIES[0];

                  return (
                    <div className="space-y-6 w-full max-w-full min-w-0">
                      
                      {/* 2A. MAIN CATEGORIES (LEVEL 1) */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6 w-full max-w-full min-w-0">
                        <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
                          <div className="min-w-0">
                            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 flex-wrap">
                              <span>1. Main Product Categories (Level 1)</span>
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1B459B]/10 text-[#1B459B] font-bold">
                                {cats.length} Categories
                              </span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                              Select a category to manage its sub-categories below, or reorder, edit, and add new categories.
                            </p>
                          </div>

                          {/* Add New Category Input */}
                          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0 min-w-0">
                            <input
                              type="text"
                              placeholder="New category name..."
                              value={newCatNameInput}
                              onChange={(e) => setNewCatNameInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddNewCategory();
                                }
                              }}
                              className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 w-44 sm:w-48 min-w-0"
                            />
                            <button
                              type="button"
                              onClick={handleAddNewCategory}
                              className="px-4 py-2 bg-[#ED1C24] hover:bg-[#d61820] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs shrink-0 whitespace-nowrap"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Category</span>
                            </button>
                          </div>
                        </div>

                        {/* Main Category Cards Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 min-w-0">
                          {cats.map((cat: any, idx: number) => {
                            const isSelected = safeIdx === idx;
                            return (
                              <div
                                key={cat.id || idx}
                                onClick={() => setSelectedAdminCatIdx(idx)}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 min-w-0 overflow-hidden ${
                                  isSelected
                                    ? "bg-blue-50/60 border-[#1B459B] shadow-md ring-2 ring-[#1B459B]/15"
                                    : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white"
                                }`}
                              >
                                <div className="space-y-1.5 min-w-0">
                                  <div className="flex items-center justify-between gap-2 min-w-0">
                                    <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
                                      #{String(idx + 1).padStart(2, "0")}
                                    </span>
                                    <span
                                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 truncate max-w-[130px] ${
                                        isSelected
                                          ? "bg-[#1B459B] text-white"
                                          : "bg-slate-200 text-slate-700"
                                      }`}
                                    >
                                      {cat.subcategories?.length || 0} Sub-categories
                                    </span>
                                  </div>

                                  <input
                                    type="text"
                                    value={cat.name || ""}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => handleUpdateCategoryName(idx, e.target.value)}
                                    className="w-full min-w-0 text-xs sm:text-sm font-black text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#1B459B] focus:bg-white focus:px-1.5 py-0.5 rounded outline-none transition truncate"
                                  />
                                </div>

                                {/* Reorder & Actions for Category */}
                                <div
                                  className="flex items-center justify-between pt-2 border-t border-slate-200/60 shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={() => handleMoveCategoryUp(idx)}
                                      className="p-1 hover:bg-slate-200 disabled:opacity-30 rounded text-slate-600 transition"
                                      title="Move Category Up"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === cats.length - 1}
                                      onClick={() => handleMoveCategoryDown(idx)}
                                      className="p-1 hover:bg-slate-200 disabled:opacity-30 rounded text-slate-600 transition"
                                      title="Move Category Down"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProductPageCategory(idx)}
                                    className="p-1 hover:bg-rose-100 rounded text-slate-400 hover:text-rose-600 transition"
                                    title="Delete Category"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2B. SUB-CATEGORIES DIRECTORY FOR ACTIVE CATEGORY (LEVEL 2 - SCREENSHOT 2 & 3 MATCH) */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6 w-full max-w-full min-w-0">
                        
                        {/* Header Row: Subcategory Title & Quick Add */}
                        <div className="border-b border-slate-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
                          <div className="min-w-0">
                            <div className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 flex-wrap">
                              <span className="truncate">2. Sub-Categories in &ldquo;{activeCat.name}&rdquo;</span>
                              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold shrink-0">
                                {activeCat.subcategories?.length || 0} Total
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              Every sub-category below has its own dedicated collection page on the website. Edit title, re-order, delete, or add new ones below.
                            </p>
                          </div>

                          {/* Add Subcategory Input */}
                          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0 min-w-0">
                            <input
                              type="text"
                              placeholder={`Add to ${activeCat.name}...`}
                              value={newSubcatInput}
                              onChange={(e) => setNewSubcatInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddSubcategory(safeIdx);
                                }
                              }}
                              className="px-3.5 py-2 bg-slate-50 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 w-48 sm:w-56 min-w-0"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddSubcategory(safeIdx)}
                              className="px-4 py-2 bg-[#1B459B] hover:bg-[#13326f] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs shrink-0 whitespace-nowrap"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Sub-category</span>
                            </button>
                          </div>
                        </div>

                        {/* Full Sub-categories Directory Grid (ALL 33 Sub-categories!) */}
                        {(!activeCat.subcategories || activeCat.subcategories.length === 0) ? (
                          <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            No sub-categories in this category yet. Type a name above and click &ldquo;+ Add Sub-category&rdquo;.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2.5 p-3 sm:p-4 bg-slate-50/70 rounded-xl border border-slate-200 max-h-[580px] overflow-y-auto min-w-0">
                            {activeCat.subcategories.map((sub: string, subIdx: number) => (
                              <div
                                key={`${sub}-${subIdx}`}
                                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-[#1B459B]/40 hover:shadow-xs transition-all group min-w-0 overflow-hidden"
                              >
                                <span className="text-[11px] font-mono font-bold text-slate-400 w-7 shrink-0 text-center">
                                  #{String(subIdx + 1).padStart(2, "0")}
                                </span>

                                <input
                                  type="text"
                                  value={sub}
                                  onChange={(e) =>
                                    handleUpdateSubcategoryName(safeIdx, subIdx, e.target.value)
                                  }
                                  className="flex-1 min-w-0 px-2.5 py-1.5 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20 transition truncate"
                                />

                                <div className="flex items-center gap-0.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveSubcategoryUp(safeIdx, subIdx)}
                                    disabled={subIdx === 0}
                                    className="p-1 hover:bg-slate-100 disabled:opacity-25 rounded text-slate-600 transition"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveSubcategoryDown(safeIdx, subIdx)}
                                    disabled={subIdx === activeCat.subcategories.length - 1}
                                    className="p-1 hover:bg-slate-100 disabled:opacity-25 rounded text-slate-600 transition"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSubcategory(safeIdx, subIdx)}
                                    className="p-1 hover:bg-rose-100 rounded text-slate-400 hover:text-rose-600 transition"
                                    title="Remove"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>

                    </div>
                  );
                })()}

                {/* 3. "CAN'T FIND WHAT YOU NEED?" HELP BOX SETTINGS (SS 2) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
                  <div className="border-b border-slate-200 pb-3">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      3. &ldquo;Can&rsquo;t Find What You Need?&rdquo; Box Settings
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Bottom bar displayed below the sub-categories list in Screenshot 2 and in the Mega Menu.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Help Title
                      </label>
                      <input
                        type="text"
                        value={(formData as any).productPage?.helpTitle || ""}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            productPage: {
                              ...((prev as any).productPage || {}),
                              helpTitle: e.target.value,
                            },
                          }))
                        }
                        placeholder="Can't find what you need?"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Help Subtitle
                      </label>
                      <input
                        type="text"
                        value={(formData as any).productPage?.helpSubtitle || ""}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            productPage: {
                              ...((prev as any).productPage || {}),
                              helpSubtitle: e.target.value,
                            },
                          }))
                        }
                        placeholder="Our team is here to help."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={(formData as any).productPage?.helpBtnText || ""}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            productPage: {
                              ...((prev as any).productPage || {}),
                              helpBtnText: e.target.value,
                            },
                          }))
                        }
                        placeholder="Contact Us"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Button Link
                      </label>
                      <input
                        type="text"
                        value={(formData as any).productPage?.helpBtnLink || ""}
                        onChange={(e) =>
                          setFormData((prev: any) => ({
                            ...prev,
                            productPage: {
                              ...((prev as any).productPage || {}),
                              helpBtnLink: e.target.value,
                            },
                          }))
                        }
                        placeholder="/contact"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1B459B]/20"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveContent}
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-[#1B459B] hover:bg-[#13326f] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "Saving..." : "Save Product Page Changes"}</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 3: SECTIONS MANAGER                                        */}
            {/* ============================================================== */}
            {activeTab === "sections" && (
              <div className="space-y-6">
                {/* 1. About 35 Years Section */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">
                        1. &quot;Built To Support Surgery&quot; Section (35+ Years)
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Placed directly underneath the Hero Section. Contains feature badges, cleanroom photo, and certifications strip.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab("about")}
                        className="px-3 py-1.5 bg-[#1B459B] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Layout className="w-3.5 h-3.5" />
                        <span>Open Dedicated Visual Editor</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.aboutSection.enabled !== false}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              aboutSection: {
                                ...formData.aboutSection,
                                enabled: e.target.checked,
                              },
                            })
                          }
                          className="w-4 h-4 text-[#ED1C24] rounded accent-[#ED1C24]"
                        />
                        <span>Visible</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Badge Tag</label>
                      <input
                        type="text"
                        value={formData.aboutSection.badge ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            aboutSection: {
                              ...formData.aboutSection,
                              badge: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                        placeholder="ABOUT US"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Title Line 1</label>
                      <input
                        type="text"
                        value={formData.aboutSection.titleLine1 ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            aboutSection: {
                              ...formData.aboutSection,
                              titleLine1: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                        placeholder="Built To Support"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Title Highlight</label>
                      <input
                        type="text"
                        value={formData.aboutSection.titleHighlight ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            aboutSection: {
                              ...formData.aboutSection,
                              titleHighlight: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-xs text-[#ED1C24] font-bold"
                        placeholder="Surgery"
                      />
                    </div>
                    <div className="sm:col-span-3 space-y-1">
                      <label className="text-xs font-bold text-slate-700">Introduction Lead</label>
                      <textarea
                        rows={2}
                        value={formData.aboutSection.intro ?? formData.aboutSection.description ?? ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            aboutSection: {
                              ...formData.aboutSection,
                              intro: e.target.value,
                              description: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Precision Section */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm">
                      2. Precision Manufacturing Showcase
                    </h3>
                    <input
                      type="checkbox"
                      checked={formData.precisionSection.enabled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          precisionSection: {
                            ...formData.precisionSection,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-[#ED1C24] rounded"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Title</label>
                      <input
                        type="text"
                        value={formData.precisionSection.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            precisionSection: {
                              ...formData.precisionSection,
                              title: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Subtitle</label>
                      <input
                        type="text"
                        value={formData.precisionSection.subtitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            precisionSection: {
                              ...formData.precisionSection,
                              subtitle: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Facility Tour Video */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm">
                      3. Facility Tour Video Section
                    </h3>
                    <input
                      type="checkbox"
                      checked={formData.videoSection.enabled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          videoSection: {
                            ...formData.videoSection,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-[#ED1C24] rounded"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Title</label>
                      <input
                        type="text"
                        value={formData.videoSection.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            videoSection: {
                              ...formData.videoSection,
                              title: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        YouTube Embed / Video URL
                      </label>
                      <input
                        type="text"
                        value={formData.videoSection.videoUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            videoSection: {
                              ...formData.videoSection,
                              videoUrl: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. CTA Banner */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <h3 className="font-bold text-slate-900 text-sm">
                      4. High-Impact Call to Action Banner
                    </h3>
                    <input
                      type="checkbox"
                      checked={formData.ctaSection.enabled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ctaSection: {
                            ...formData.ctaSection,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4 text-[#ED1C24] rounded"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">CTA Title</label>
                      <input
                        type="text"
                        value={formData.ctaSection.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ctaSection: {
                              ...formData.ctaSection,
                              title: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">CTA Subtitle</label>
                      <input
                        type="text"
                        value={formData.ctaSection.subtitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            ctaSection: {
                              ...formData.ctaSection,
                              subtitle: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveContent}
                    className="px-6 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Section Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 4: CONTACT & COMPANY INFO                                  */}
            {/* ============================================================== */}
            {activeTab === "contact" && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-slate-900">
                    Contact & Company Details
                  </h2>
                  <p className="text-xs text-slate-500">
                    Updates the top utility bar, footer, and inquiry email destinations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Factory Physical Address
                    </label>
                    <input
                      type="text"
                      value={formData.topBar.address}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          topBar: { ...formData.topBar, address: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Primary Telephone
                    </label>
                    <input
                      type="text"
                      value={formData.topBar.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          topBar: { ...formData.topBar, phone: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Mobile / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={formData.topBar.mobile || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          topBar: { ...formData.topBar, mobile: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Official Contact Emails (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.topBar.emails.join(", ")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          topBar: {
                            ...formData.topBar,
                            emails: e.target.value.split(",").map((s) => s.trim()),
                          },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSaveContent}
                    className="px-6 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Contact Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB: ABOUT US PAGE SETTINGS                                    */}
            {/* ============================================================== */}
            {activeTab === "page-about" && (() => {
              const about = {
                ...DEFAULT_ABOUT_CONTENT,
                ...((formData as any).aboutPage || {}),
                stats: ((formData as any).aboutPage?.stats && (formData as any).aboutPage.stats.length > 0)
                  ? (formData as any).aboutPage.stats
                  : DEFAULT_ABOUT_CONTENT.stats,
                accreditations: ((formData as any).aboutPage?.accreditations && (formData as any).aboutPage.accreditations.length > 0)
                  ? (formData as any).aboutPage.accreditations
                  : DEFAULT_ABOUT_CONTENT.accreditations,
              };

              return (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-black text-slate-900">
                          About Us Page Management
                        </h2>
                        <p className="text-xs text-slate-500">
                          Manage hero animated banner, company heritage story, stats counters, and accreditation certificates.
                        </p>
                      </div>
                      <button
                        onClick={handleSaveContent}
                        className="px-5 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>

                    {/* 1. Hero Banner Settings */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#ED1C24]" />
                        <span>1. Hero Section Banner & Animated Title</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700">Top Badge Headline</label>
                          <input
                            type="text"
                            value={about.bannerHeadline || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                aboutPage: { ...about, bannerHeadline: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                            placeholder="e.g. OVER 35 YEARS OF MANUFACTURING EXCELLENCE"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Title Line 1 (Dark Text)</label>
                          <input
                            type="text"
                            value={about.bannerTitleLine1 || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                aboutPage: { ...about, bannerTitleLine1: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                            placeholder="e.g. CARE WITH TRUST IN SURGERY."
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Title Highlight (Red Accent)</label>
                          <input
                            type="text"
                            value={about.bannerTitleHighlight || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                aboutPage: { ...about, bannerTitleHighlight: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                            placeholder="e.g. EVERY INSTRUMENT, EVERY CUT."
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-2 p-3 bg-white rounded-lg border">
                          <label className="text-xs font-bold text-slate-700 flex justify-between">
                            <span>Banner Background Image</span>
                            <span className="text-[10px] text-slate-400">High-res surgical factory or surgeon banner</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={about.bannerImage || ""}
                              onChange={(e) =>
                                setFormData((prev: any) => ({
                                  ...prev,
                                  aboutPage: { ...about, bannerImage: e.target.value },
                                }))
                              }
                              className="flex-1 px-3 py-1.5 border rounded-lg text-xs bg-white"
                            />
                            <label className="px-4 py-2 bg-[#1B459B] text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-800 transition shrink-0 flex items-center gap-1.5">
                              {isUploadingAboutBanner ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                              <span>Upload Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAboutBannerUpload}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Mission & Heritage */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#1B459B]" />
                        <span>2. Company Mission & Global Heritage</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Section Subtitle</label>
                          <input
                            type="text"
                            value={about.missionSubtitle || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                aboutPage: { ...about, missionSubtitle: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Main Heading</label>
                          <input
                            type="text"
                            value={about.missionTitle || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                aboutPage: { ...about, missionTitle: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-700">Heritage Narrative 1</label>
                          <textarea
                            rows={3}
                            value={about.missionText1 || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                aboutPage: { ...about, missionText1: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-700">Heritage Narrative 2</label>
                          <textarea
                            rows={3}
                            value={about.missionText2 || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                aboutPage: { ...about, missionText2: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Numerical Statistics Counters (4 stats) */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>3. Numerical Statistics Counters ({about.stats.length} Items)</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [
                              ...about.stats,
                              { value: "", suffix: "+", label: "", description: "" },
                            ];
                            setFormData((prev: any) => ({
                              ...prev,
                              aboutPage: { ...about, stats: updated },
                            }));
                          }}
                          className="px-3 py-1 bg-[#1B459B] text-white rounded text-xs font-bold hover:bg-blue-800 transition flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Stat</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {about.stats.map((stat: any, sIdx: number) => (
                          <div key={sIdx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-400">Stat #{sIdx + 1}</span>
                              {about.stats.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = about.stats.filter((_: any, i: number) => i !== sIdx);
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      aboutPage: { ...about, stats: updated },
                                    }));
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xs font-bold"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-2 space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Value</label>
                                <input
                                  type="text"
                                  value={stat.value ?? ""}
                                  placeholder="e.g. 250"
                                  onChange={(e) => {
                                    const updated = [...about.stats];
                                    updated[sIdx] = { ...updated[sIdx], value: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      aboutPage: { ...about, stats: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-bold font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Suffix</label>
                                <input
                                  type="text"
                                  value={stat.suffix || "+"}
                                  placeholder="e.g. +"
                                  onChange={(e) => {
                                    const updated = [...about.stats];
                                    updated[sIdx] = { ...updated[sIdx], suffix: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      aboutPage: { ...about, stats: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-bold text-center font-mono"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-600">Label</label>
                              <input
                                type="text"
                                value={stat.label || ""}
                                placeholder="e.g. Skilled Toolmakers"
                                onChange={(e) => {
                                  const updated = [...about.stats];
                                  updated[sIdx] = { ...updated[sIdx], label: e.target.value };
                                  setFormData((prev: any) => ({
                                    ...prev,
                                    aboutPage: { ...about, stats: updated },
                                  }));
                                }}
                                className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-bold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-600">Description</label>
                              <input
                                type="text"
                                value={stat.description || ""}
                                placeholder="e.g. Master metallurgical craftsmen"
                                onChange={(e) => {
                                  const updated = [...about.stats];
                                  updated[sIdx] = { ...updated[sIdx], description: e.target.value };
                                  setFormData((prev: any) => ({
                                    ...prev,
                                    aboutPage: { ...about, stats: updated },
                                  }));
                                }}
                                className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 4. Accreditations & Certifications */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Award className="w-4 h-4 text-emerald-600" />
                          <span>4. Quality Accreditations & Compliance Standards ({about.accreditations.length})</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [
                              ...about.accreditations,
                              { title: "", desc: "" },
                            ];
                            setFormData((prev: any) => ({
                              ...prev,
                              aboutPage: { ...about, accreditations: updated },
                            }));
                          }}
                          className="px-3 py-1 bg-[#1B459B] text-white rounded text-xs font-bold hover:bg-blue-800 transition flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Accreditation</span>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {about.accreditations.map((acc: any, aIdx: number) => (
                          <div key={aIdx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-[11px] font-bold text-slate-600">Accreditation #{aIdx + 1}</label>
                              {about.accreditations.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = about.accreditations.filter((_: any, i: number) => i !== aIdx);
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      aboutPage: { ...about, accreditations: updated },
                                    }));
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xs font-bold"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <input
                              type="text"
                              value={acc.title || ""}
                              placeholder="e.g. ISO 13485:2016 Certified"
                              onChange={(e) => {
                                const updated = [...about.accreditations];
                                updated[aIdx] = { ...updated[aIdx], title: e.target.value };
                                setFormData((prev: any) => ({
                                  ...prev,
                                  aboutPage: { ...about, accreditations: updated },
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-bold"
                            />
                            <textarea
                              rows={2}
                              value={acc.desc || ""}
                              placeholder="e.g. Medical Devices Quality Management System certification for international export."
                              onChange={(e) => {
                                const updated = [...about.accreditations];
                                updated[aIdx] = { ...updated[aIdx], desc: e.target.value };
                                setFormData((prev: any) => ({
                                  ...prev,
                                  aboutPage: { ...about, accreditations: updated },
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 5. Explore Product Range CTA Button */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-[#ED1C24]" />
                        <span>5. Accreditations Box Action Button (&quot;Explore Product Range&quot;)</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Button Text</label>
                          <input
                            type="text"
                            value={about.buttonText || "Explore Product Range"}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                aboutPage: { ...about, buttonText: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Button Destination URL</label>
                          <input
                            type="text"
                            value={about.buttonLink || "/products"}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                aboutPage: { ...about, buttonLink: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleSaveContent}
                        className="px-6 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save All About Us Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ============================================================== */}
            {/* TAB: DEPARTMENTS PAGE SETTINGS                                 */}
            {/* ============================================================== */}
            {activeTab === "page-departments" && (() => {
              const depts = {
                ...DEFAULT_DEPARTMENTS_CONTENT,
                ...((formData as any).departmentsPage || {}),
                clinicalSpecialties: ((formData as any).departmentsPage?.clinicalSpecialties && (formData as any).departmentsPage.clinicalSpecialties.length > 0)
                  ? (formData as any).departmentsPage.clinicalSpecialties
                  : DEFAULT_DEPARTMENTS_CONTENT.clinicalSpecialties,
                manufacturingDivisions: ((formData as any).departmentsPage?.manufacturingDivisions && (formData as any).departmentsPage.manufacturingDivisions.length > 0)
                  ? (formData as any).departmentsPage.manufacturingDivisions
                  : DEFAULT_DEPARTMENTS_CONTENT.manufacturingDivisions,
              };

              return (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-black text-slate-900">
                          Departments Page Management
                        </h2>
                        <p className="text-xs text-slate-500">
                          Manage clinical instrument specialties, manufacturing infrastructure divisions, and hero animated banner.
                        </p>
                      </div>
                      <button
                        onClick={handleSaveContent}
                        className="px-5 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>

                    {/* 1. Hero Banner Settings */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#ED1C24]" />
                        <span>1. Hero Section Banner & Animated Title</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700">Top Badge Headline</label>
                          <input
                            type="text"
                            value={depts.bannerHeadline || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                departmentsPage: { ...depts, bannerHeadline: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Title Line 1</label>
                          <input
                            type="text"
                            value={depts.bannerTitleLine1 || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                departmentsPage: { ...depts, bannerTitleLine1: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Title Highlight</label>
                          <input
                            type="text"
                            value={depts.bannerTitleHighlight || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                departmentsPage: { ...depts, bannerTitleHighlight: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-2 p-3 bg-white rounded-lg border">
                          <label className="text-xs font-bold text-slate-700 flex justify-between">
                            <span>Banner Background Image</span>
                            <span className="text-[10px] text-slate-400">High-res header banner</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={depts.bannerImage || ""}
                              onChange={(e) =>
                                setFormData((prev: any) => ({
                                  ...prev,
                                  departmentsPage: { ...depts, bannerImage: e.target.value },
                                }))
                              }
                              className="flex-1 px-3 py-1.5 border rounded-lg text-xs bg-white"
                            />
                            <label className="px-4 py-2 bg-[#1B459B] text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-800 transition shrink-0 flex items-center gap-1.5">
                              {isUploadingDepartmentsBanner ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                              <span>Upload Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleDepartmentsBannerUpload}
                              />
                            </label>
                          </div>
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-700">Subtitle Description</label>
                          <textarea
                            rows={2}
                            value={depts.subtitle || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                departmentsPage: { ...depts, subtitle: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Clinical Instrument Specialties */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#1B459B]" />
                          <span>2. Clinical Instrument Specialties ({depts.clinicalSpecialties.length})</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            const currentSpecs = depts.clinicalSpecialties;
                            const newSpec = {
                              id: `spec-${Date.now()}`,
                              code: `0${currentSpecs.length + 1}`,
                              name: "",
                              slug: "",
                              description: "",
                            };
                            setFormData((prev: any) => ({
                              ...prev,
                              departmentsPage: {
                                ...depts,
                                clinicalSpecialties: [...currentSpecs, newSpec],
                              },
                            }));
                          }}
                          className="px-3.5 py-1.5 bg-[#1B459B] text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Specialty</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {depts.clinicalSpecialties.map((spec: any, sIdx: number) => (
                          <div key={sIdx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <span className="text-xs font-black text-slate-800">Specialty #{sIdx + 1}{spec.name ? `: ${spec.name}` : ""}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentSpecs = [...depts.clinicalSpecialties];
                                  setFormData((prev: any) => ({
                                    ...prev,
                                    departmentsPage: {
                                      ...depts,
                                      clinicalSpecialties: currentSpecs.filter((_, i) => i !== sIdx),
                                    },
                                  }));
                                }}
                                className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                                title="Delete Specialty"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Code / Number (e.g. 01)</label>
                                <input
                                  type="text"
                                  value={spec.code || ""}
                                  placeholder="e.g. 01"
                                  onChange={(e) => {
                                    const updated = [...depts.clinicalSpecialties];
                                    updated[sIdx] = { ...updated[sIdx], code: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      departmentsPage: { ...depts, clinicalSpecialties: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono font-bold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Specialty Name</label>
                                <input
                                  type="text"
                                  value={spec.name || ""}
                                  placeholder="e.g. General Instrumentation"
                                  onChange={(e) => {
                                    const updated = [...depts.clinicalSpecialties];
                                    updated[sIdx] = { ...updated[sIdx], name: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      departmentsPage: { ...depts, clinicalSpecialties: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Category Slug Link</label>
                                <input
                                  type="text"
                                  value={spec.slug || ""}
                                  placeholder="e.g. general-instrumentation"
                                  onChange={(e) => {
                                    const updated = [...depts.clinicalSpecialties];
                                    updated[sIdx] = { ...updated[sIdx], slug: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      departmentsPage: { ...depts, clinicalSpecialties: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono"
                                />
                              </div>
                              <div className="sm:col-span-3 space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Description</label>
                                <textarea
                                  rows={2}
                                  value={spec.description || ""}
                                  placeholder="Precision medical instruments engineered for surgical excellence..."
                                  onChange={(e) => {
                                    const updated = [...depts.clinicalSpecialties];
                                    updated[sIdx] = { ...updated[sIdx], description: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      departmentsPage: { ...depts, clinicalSpecialties: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3. Manufacturing & Quality Divisions */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Factory className="w-4 h-4 text-[#ED1C24]" />
                          <span>3. Manufacturing & Quality Divisions ({depts.manufacturingDivisions.length})</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            const currentMfgs = depts.manufacturingDivisions;
                            const newMfg = {
                              id: `mfg-${Date.now()}`,
                              badge: `DIVISION 0${currentMfgs.length + 1}`,
                              title: "",
                              desc: "",
                            };
                            setFormData((prev: any) => ({
                              ...prev,
                              departmentsPage: {
                                ...depts,
                                manufacturingDivisions: [...currentMfgs, newMfg],
                              },
                            }));
                          }}
                          className="px-3.5 py-1.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Division</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {depts.manufacturingDivisions.map((mfg: any, mIdx: number) => (
                          <div key={mIdx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <span className="text-xs font-black text-slate-800">Division #{mIdx + 1}{mfg.title ? `: ${mfg.title}` : ""}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentMfgs = [...depts.manufacturingDivisions];
                                  setFormData((prev: any) => ({
                                    ...prev,
                                    departmentsPage: {
                                      ...depts,
                                      manufacturingDivisions: currentMfgs.filter((_, i) => i !== mIdx),
                                    },
                                  }));
                                }}
                                className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                                title="Delete Division"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Division Badge (e.g. DIVISION 01)</label>
                                <input
                                  type="text"
                                  value={mfg.badge || ""}
                                  placeholder="e.g. DIVISION 01"
                                  onChange={(e) => {
                                    const updated = [...depts.manufacturingDivisions];
                                    updated[mIdx] = { ...updated[mIdx], badge: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      departmentsPage: { ...depts, manufacturingDivisions: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono font-bold"
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Division Title</label>
                                <input
                                  type="text"
                                  value={mfg.title || ""}
                                  placeholder="e.g. High-Tonnage Forging Division"
                                  onChange={(e) => {
                                    const updated = [...depts.manufacturingDivisions];
                                    updated[mIdx] = { ...updated[mIdx], title: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      departmentsPage: { ...depts, manufacturingDivisions: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-semibold"
                                />
                              </div>
                              <div className="sm:col-span-3 space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Description</label>
                                <textarea
                                  rows={2}
                                  value={mfg.desc || ""}
                                  placeholder="Specialized infrastructure and metallurgical processing unit..."
                                  onChange={(e) => {
                                    const updated = [...depts.manufacturingDivisions];
                                    updated[mIdx] = { ...updated[mIdx], desc: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      departmentsPage: { ...depts, manufacturingDivisions: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleSaveContent}
                        className="px-6 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save All Departments Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ============================================================== */}
            {/* TAB: RESOURCES & CATALOGUES SETTINGS                           */}
            {/* ============================================================== */}
            {activeTab === "page-resources" && (() => {
              const resources = {
                ...DEFAULT_RESOURCES_CONTENT,
                ...((formData as any).resourcesPage || {}),
                catalogs: ((formData as any).resourcesPage?.catalogs && (formData as any).resourcesPage.catalogs.length > 0)
                  ? (formData as any).resourcesPage.catalogs
                  : DEFAULT_RESOURCES_CONTENT.catalogs,
              };

              return (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-black text-slate-900">
                          Resources & Catalogues Management
                        </h2>
                        <p className="text-xs text-slate-500">
                          Manage technical PDF catalogues, download counters, file attachments, and hero animated banner.
                        </p>
                      </div>
                      <button
                        onClick={handleSaveContent}
                        className="px-5 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>

                    {/* 1. Hero Banner Settings */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#ED1C24]" />
                        <span>1. Hero Section Banner & Animated Title</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700">Top Badge Headline</label>
                          <input
                            type="text"
                            value={resources.bannerHeadline || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                resourcesPage: { ...resources, bannerHeadline: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Title Line 1</label>
                          <input
                            type="text"
                            value={resources.bannerTitleLine1 || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                resourcesPage: { ...resources, bannerTitleLine1: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Title Highlight</label>
                          <input
                            type="text"
                            value={resources.bannerTitleHighlight || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                resourcesPage: { ...resources, bannerTitleHighlight: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-2 p-3 bg-white rounded-lg border">
                          <label className="text-xs font-bold text-slate-700 flex justify-between">
                            <span>Banner Background Image</span>
                            <span className="text-[10px] text-slate-400">High-res header banner</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={resources.bannerImage || ""}
                              onChange={(e) =>
                                setFormData((prev: any) => ({
                                  ...prev,
                                  resourcesPage: { ...resources, bannerImage: e.target.value },
                                }))
                              }
                              className="flex-1 px-3 py-1.5 border rounded-lg text-xs bg-white"
                            />
                            <label className="px-4 py-2 bg-[#1B459B] text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-800 transition shrink-0 flex items-center gap-1.5">
                              {isUploadingResourcesBanner ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                              <span>Upload Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleResourcesBannerUpload}
                              />
                            </label>
                          </div>
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-700">Intro Subtitle</label>
                          <textarea
                            rows={2}
                            value={resources.subtitle || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                resourcesPage: { ...resources, subtitle: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Catalogues Directory */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#1B459B]" />
                          <span>2. Technical Catalogues & PDFs ({resources.catalogs.length})</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            const currentCats = resources.catalogs;
                            const newCatItem = {
                              id: `cat-${Date.now()}`,
                              title: "",
                              category_name: "",
                              description: "",
                              file_url: "",
                              file_size: "",
                              downloads_count: 0,
                            };
                            setFormData((prev: any) => ({
                              ...prev,
                              resourcesPage: {
                                ...resources,
                                catalogs: [...currentCats, newCatItem],
                              },
                            }));
                          }}
                          className="px-3.5 py-1.5 bg-[#1B459B] text-white rounded-lg text-xs font-bold hover:bg-blue-800 transition flex items-center gap-1.5 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Catalogue</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {resources.catalogs.map((cat: any, cIdx: number) => (
                          <div key={cIdx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <span className="text-xs font-black text-slate-800">Catalogue #{cIdx + 1}{cat.title ? `: ${cat.title}` : ""}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentCats = [...resources.catalogs];
                                  setFormData((prev: any) => ({
                                    ...prev,
                                    resourcesPage: {
                                      ...resources,
                                      catalogs: currentCats.filter((_, i) => i !== cIdx),
                                    },
                                  }));
                                }}
                                className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                                title="Delete Catalogue"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Catalogue Title</label>
                                <input
                                  type="text"
                                  value={cat.title || ""}
                                  placeholder="e.g. General Surgery Complete Catalogue"
                                  onChange={(e) => {
                                    const updated = [...resources.catalogs];
                                    updated[cIdx] = { ...updated[cIdx], title: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      resourcesPage: { ...resources, catalogs: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Category Tag</label>
                                <input
                                  type="text"
                                  value={cat.category_name || ""}
                                  placeholder="e.g. General Surgery"
                                  onChange={(e) => {
                                    const updated = [...resources.catalogs];
                                    updated[cIdx] = { ...updated[cIdx], category_name: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      resourcesPage: { ...resources, catalogs: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Description</label>
                                <textarea
                                  rows={2}
                                  value={cat.description || ""}
                                  placeholder="Comprehensive guide to specialized medical instruments..."
                                  onChange={(e) => {
                                    const updated = [...resources.catalogs];
                                    updated[cIdx] = { ...updated[cIdx], description: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      resourcesPage: { ...resources, catalogs: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                                />
                              </div>
                              <div className="sm:col-span-2 space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">PDF Document URL or File Upload</label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={cat.file_url || ""}
                                    placeholder="/catalogs/filename.pdf or click Upload PDF"
                                    onChange={(e) => {
                                      const updated = [...resources.catalogs];
                                      updated[cIdx] = { ...updated[cIdx], file_url: e.target.value };
                                      setFormData((prev: any) => ({
                                        ...prev,
                                        resourcesPage: { ...resources, catalogs: updated },
                                      }));
                                    }}
                                    className="flex-1 px-2.5 py-1.5 border rounded-lg text-xs font-mono"
                                  />
                                  <label className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-700 transition shrink-0 flex items-center gap-1.5">
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Upload PDF</span>
                                    <input
                                      type="file"
                                      accept=".pdf,application/pdf"
                                      className="hidden"
                                      onChange={(e) => handleResourcesCatalogPdfUpload(cIdx, e)}
                                    />
                                  </label>
                                  {cat.file_url && (
                                    <a
                                      href={cat.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                                      title="View / Preview Catalogue PDF in new tab"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      <span>View PDF</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">File Size (e.g. 18.4 MB)</label>
                                <input
                                  type="text"
                                  value={cat.file_size || ""}
                                  placeholder="e.g. 15.0 MB"
                                  onChange={(e) => {
                                    const updated = [...resources.catalogs];
                                    updated[cIdx] = { ...updated[cIdx], file_size: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      resourcesPage: { ...resources, catalogs: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Downloads Count</label>
                                <input
                                  type="number"
                                  value={cat.downloads_count || 0}
                                  onChange={(e) => {
                                    const updated = [...resources.catalogs];
                                    updated[cIdx] = { ...updated[cIdx], downloads_count: parseInt(e.target.value) || 0 };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      resourcesPage: { ...resources, catalogs: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleSaveContent}
                        className="px-6 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save All Resources Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ============================================================== */}
            {/* TAB: SUSTAINABILITY PAGE SETTINGS                              */}
            {/* ============================================================== */}
            {activeTab === "page-sustainability" && (() => {
              const sus = {
                ...DEFAULT_SUSTAINABILITY_CONTENT,
                ...((formData as any).sustainabilityPage || {}),
                initiatives: ((formData as any).sustainabilityPage?.initiatives && (formData as any).sustainabilityPage.initiatives.length > 0)
                  ? (formData as any).sustainabilityPage.initiatives
                  : DEFAULT_SUSTAINABILITY_CONTENT.initiatives,
                stats: ((formData as any).sustainabilityPage?.stats && (formData as any).sustainabilityPage.stats.length > 0)
                  ? (formData as any).sustainabilityPage.stats
                  : DEFAULT_SUSTAINABILITY_CONTENT.stats,
              };

              return (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-black text-slate-900">
                          Sustainability & Green Manufacturing
                        </h2>
                        <p className="text-xs text-slate-500">
                          Manage eco-friendly manufacturing initiatives, solar power metrics, and sustainability hero banner.
                        </p>
                      </div>
                      <button
                        onClick={handleSaveContent}
                        className="px-5 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>

                    {/* 1. Hero Banner Settings */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#ED1C24]" />
                        <span>1. Hero Section Banner & Animated Title</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700">Top Badge Headline</label>
                          <input
                            type="text"
                            value={sus.bannerHeadline || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                sustainabilityPage: { ...sus, bannerHeadline: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Title Line 1</label>
                          <input
                            type="text"
                            value={sus.bannerTitleLine1 || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                sustainabilityPage: { ...sus, bannerTitleLine1: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Title Highlight</label>
                          <input
                            type="text"
                            value={sus.bannerTitleHighlight || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                sustainabilityPage: { ...sus, bannerTitleHighlight: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-2 p-3 bg-white rounded-lg border">
                          <label className="text-xs font-bold text-slate-700 flex justify-between">
                            <span>Banner Background Image</span>
                            <span className="text-[10px] text-slate-400">Green manufacturing or solar campus banner</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={sus.bannerImage || ""}
                              onChange={(e) =>
                                setFormData((prev: any) => ({
                                  ...prev,
                                  sustainabilityPage: { ...sus, bannerImage: e.target.value },
                                }))
                              }
                              className="flex-1 px-3 py-1.5 border rounded-lg text-xs bg-white"
                            />
                            <label className="px-4 py-2 bg-[#1B459B] text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-800 transition shrink-0 flex items-center gap-1.5">
                              {isUploadingSustainabilityBanner ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                              <span>Upload Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleSustainabilityBannerUpload}
                              />
                            </label>
                          </div>
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-700">Intro Narrative Text</label>
                          <textarea
                            rows={3}
                            value={sus.introText || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                sustainabilityPage: { ...sus, introText: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Green Manufacturing Initiatives (4 Pillars) */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-emerald-600" />
                          <span>2. Eco-Friendly Manufacturing Pillars ({sus.initiatives.length} Initiatives)</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            const current = sus.initiatives;
                            const newInit = {
                              id: `init-${Date.now()}`,
                              title: "",
                              desc: "",
                              icon: "leaf",
                            };
                            setFormData((prev: any) => ({
                              ...prev,
                              sustainabilityPage: {
                                ...sus,
                                initiatives: [...current, newInit],
                              },
                            }));
                          }}
                          className="px-3 py-1 bg-[#1B459B] text-white rounded text-xs font-bold hover:bg-blue-800 transition flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Initiative</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {sus.initiatives.map((init: any, iIdx: number) => (
                          <div key={iIdx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-700">Initiative #{iIdx + 1}{init.title ? `: ${init.title}` : ""}</span>
                              <div className="flex items-center gap-2">
                                <select
                                  value={init.icon || "leaf"}
                                  onChange={(e) => {
                                    const updated = [...sus.initiatives];
                                    updated[iIdx] = { ...updated[iIdx], icon: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      sustainabilityPage: { ...sus, initiatives: updated },
                                    }));
                                  }}
                                  className="text-xs px-2 py-1 border rounded bg-slate-50 font-medium"
                                >
                                  <option value="recycle">Recycle Steel</option>
                                  <option value="sun">Solar Energy</option>
                                  <option value="droplets">Water Treatment</option>
                                  <option value="leaf">Eco Packaging</option>
                                </select>
                                {sus.initiatives.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = sus.initiatives.filter((_: any, i: number) => i !== iIdx);
                                      setFormData((prev: any) => ({
                                        ...prev,
                                        sustainabilityPage: { ...sus, initiatives: updated },
                                      }));
                                    }}
                                    className="text-red-500 hover:text-red-700 text-xs font-bold"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                            <input
                              type="text"
                              value={init.title || ""}
                              placeholder="e.g. 100% Recyclable Packaging"
                              onChange={(e) => {
                                const updated = [...sus.initiatives];
                                updated[iIdx] = { ...updated[iIdx], title: e.target.value };
                                setFormData((prev: any) => ({
                                  ...prev,
                                  sustainabilityPage: { ...sus, initiatives: updated },
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-bold"
                            />
                            <textarea
                              rows={3}
                              value={init.desc || ""}
                              placeholder="Sustainable industrial operations and green manufacturing practice..."
                              onChange={(e) => {
                                const updated = [...sus.initiatives];
                                updated[iIdx] = { ...updated[iIdx], desc: e.target.value };
                                setFormData((prev: any) => ({
                                  ...prev,
                                  sustainabilityPage: { ...sus, initiatives: updated },
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3. Performance Metrics / Stats */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <span>3. Ecological Impact Metrics ({sus.stats.length} Stats)</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            const current = sus.stats;
                            const newStat = {
                              value: "",
                              suffix: "%",
                              label: "",
                              desc: "",
                            };
                            setFormData((prev: any) => ({
                              ...prev,
                              sustainabilityPage: {
                                ...sus,
                                stats: [...current, newStat],
                              },
                            }));
                          }}
                          className="px-3 py-1 bg-[#1B459B] text-white rounded text-xs font-bold hover:bg-blue-800 transition flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add Metric</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {sus.stats.map((st: any, stIdx: number) => (
                          <div key={stIdx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-400">Metric #{stIdx + 1}</span>
                              {sus.stats.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = sus.stats.filter((_: any, i: number) => i !== stIdx);
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      sustainabilityPage: { ...sus, stats: updated },
                                    }));
                                  }}
                                  className="text-red-500 hover:text-red-700 text-xs font-bold"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="col-span-2 space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Value</label>
                                <input
                                  type="text"
                                  value={st.value ?? ""}
                                  placeholder="e.g. 95"
                                  onChange={(e) => {
                                    const updated = [...sus.stats];
                                    updated[stIdx] = { ...updated[stIdx], value: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      sustainabilityPage: { ...sus, stats: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-bold font-mono"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-600">Suffix</label>
                                <input
                                  type="text"
                                  value={st.suffix || ""}
                                  placeholder="e.g. %"
                                  onChange={(e) => {
                                    const updated = [...sus.stats];
                                    updated[stIdx] = { ...updated[stIdx], suffix: e.target.value };
                                    setFormData((prev: any) => ({
                                      ...prev,
                                      sustainabilityPage: { ...sus, stats: updated },
                                    }));
                                  }}
                                  className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-bold text-center font-mono"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-600">Label</label>
                              <input
                                type="text"
                                value={st.label || ""}
                                placeholder="e.g. Energy Efficiency"
                                onChange={(e) => {
                                  const updated = [...sus.stats];
                                  updated[stIdx] = { ...updated[stIdx], label: e.target.value };
                                  setFormData((prev: any) => ({
                                    ...prev,
                                    sustainabilityPage: { ...sus, stats: updated },
                                  }));
                                }}
                                className="w-full px-2.5 py-1.5 border rounded-lg text-xs font-bold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-600">Description</label>
                              <input
                                type="text"
                                value={st.desc || ""}
                                placeholder="e.g. Sustainable industrial operations"
                                onChange={(e) => {
                                  const updated = [...sus.stats];
                                  updated[stIdx] = { ...updated[stIdx], desc: e.target.value };
                                  setFormData((prev: any) => ({
                                    ...prev,
                                    sustainabilityPage: { ...sus, stats: updated },
                                  }));
                                }}
                                className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleSaveContent}
                        className="px-6 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save All Sustainability Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ============================================================== */}
            {/* TAB: CONTACT US PAGE SETTINGS                                  */}
            {/* ============================================================== */}
            {activeTab === "page-contact" && (() => {
              const contact = {
                ...DEFAULT_CONTACT_CONTENT,
                ...((formData as any).contactPage || {}),
              };

              return (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                    <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-black text-slate-900">
                          Contact Us Page Management
                        </h2>
                        <p className="text-xs text-slate-500">
                          Manage export office location, telephone lines, inquiry emails, hours, and hero animated banner.
                        </p>
                      </div>
                      <button
                        onClick={handleSaveContent}
                        className="px-5 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>

                    {/* 1. Hero Banner Settings */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#ED1C24]" />
                        <span>1. Hero Section Banner & Animated Title</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700">Top Badge Headline</label>
                          <input
                            type="text"
                            value={contact.bannerHeadline || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                contactPage: { ...contact, bannerHeadline: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Title Line 1</label>
                          <input
                            type="text"
                            value={contact.bannerTitleLine1 || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                contactPage: { ...contact, bannerTitleLine1: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Title Highlight</label>
                          <input
                            type="text"
                            value={contact.bannerTitleHighlight || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                contactPage: { ...contact, bannerTitleHighlight: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-2 p-3 bg-white rounded-lg border">
                          <label className="text-xs font-bold text-slate-700 flex justify-between">
                            <span>Banner Background Image</span>
                            <span className="text-[10px] text-slate-400">Headquarters or factory communications banner</span>
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={contact.bannerImage || ""}
                              onChange={(e) =>
                                setFormData((prev: any) => ({
                                  ...prev,
                                  contactPage: { ...contact, bannerImage: e.target.value },
                                }))
                              }
                              className="flex-1 px-3 py-1.5 border rounded-lg text-xs bg-white"
                            />
                            <label className="px-4 py-2 bg-[#1B459B] text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-800 transition shrink-0 flex items-center gap-1.5">
                              {isUploadingContactBanner ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                              <span>Upload Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleContactBannerUpload}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Factory Details */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#ED1C24]" />
                        <span>2. Direct Factory Export Credentials</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-700">Factory Physical Address</label>
                          <input
                            type="text"
                            value={contact.address || formData.topBar?.address || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                topBar: { ...(prev.topBar || {}), address: e.target.value },
                                contactPage: { ...contact, address: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Primary Telephone Lines</label>
                          <input
                            type="text"
                            value={contact.phone || formData.topBar?.phone || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                topBar: { ...(prev.topBar || {}), phone: e.target.value },
                                contactPage: { ...contact, phone: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Mobile / WhatsApp Direct</label>
                          <input
                            type="text"
                            value={contact.mobile || formData.topBar?.mobile || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                topBar: { ...(prev.topBar || {}), mobile: e.target.value },
                                contactPage: { ...contact, mobile: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">General Export Email</label>
                          <input
                            type="email"
                            value={contact.primaryEmail || formData.topBar?.emails?.[0] || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData((prev: any) => {
                                const existingEmails = prev.topBar?.emails || [];
                                const newEmails = [val, ...(existingEmails.slice(1))].filter(Boolean);
                                return {
                                  ...prev,
                                  topBar: { ...(prev.topBar || {}), emails: newEmails },
                                  contactPage: { ...contact, primaryEmail: val },
                                };
                              });
                            }}
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Direct Commercial Manager Email</label>
                          <input
                            type="email"
                            value={contact.directEmail || formData.topBar?.emails?.[1] || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData((prev: any) => {
                                const existingEmails = prev.topBar?.emails || [];
                                const newEmails = [existingEmails[0] || "info@endotech.com.pk", val];
                                return {
                                  ...prev,
                                  topBar: { ...(prev.topBar || {}), emails: newEmails },
                                  contactPage: { ...contact, directEmail: val },
                                };
                              });
                            }}
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-700">Factory Operating Hours</label>
                          <input
                            type="text"
                            value={contact.workingHours || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                contactPage: { ...contact, workingHours: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-700">SLA Response Guarantee Note</label>
                          <input
                            type="text"
                            value={contact.inquiryNote || ""}
                            onChange={(e) =>
                              setFormData((prev: any) => ({
                                ...prev,
                                contactPage: { ...contact, inquiryNote: e.target.value },
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleSaveContent}
                        className="px-6 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-lg text-xs font-bold tracking-wider uppercase transition shadow-md flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save All Contact Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ============================================================== */}
            {/* TAB 5: LIVE PREVIEW                                            */}
            {/* ============================================================== */}
            {activeTab === "preview" && (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-slate-300 ml-2 font-mono">
                      https://endotech.com.pk (Live Viewport)
                    </span>
                  </div>
                  <Link
                    href="/"
                    target="_blank"
                    className="text-xs text-white hover:text-[#ED1C24] flex items-center gap-1 font-bold"
                  >
                    <span>Open in Full Tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <iframe
                  src="/"
                  title="Live Preview"
                  className="w-full h-[750px] border-0"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PRODUCT ADD / EDIT MODAL (FIXED HEADER & FIXED STICKY FOOTER)  */}
      {/* ============================================================== */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full flex flex-col max-h-[90vh] shadow-2xl border border-slate-200 overflow-hidden relative">
            
            {/* 1. FIXED MODAL HEADER */}
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingProduct ? `Edit Product: ${editingProduct.code || ""}` : "Add New Surgical Product"}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure instrument SKU, category, available sizes, custom specs, and image views.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProductModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition text-base font-bold"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* 2. SCROLLABLE FORM BODY */}
            <form id="productModalForm" onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Code / SKU *</label>
                  <input
                    type="text"
                    required
                    value={productForm.code}
                    onChange={(e) =>
                      setProductForm({ ...productForm, code: e.target.value })
                    }
                    placeholder="e.g. ET-KR-101"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => {
                      const selectedSlug = e.target.value;
                      const allCats = getBaseCategories(formData);
                      const matched = allCats.find((c: any) => (c.slug || c.id) === selectedSlug);
                      const firstSub = matched?.subcategories?.[0] || "";
                      setProductForm({
                        ...productForm,
                        category: selectedSlug,
                        subcategory: firstSub,
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-lg text-xs font-semibold text-slate-800 bg-white"
                  >
                    {getBaseCategories(formData).map((cat: any) => (
                      <option key={cat.id || cat.slug} value={cat.slug || cat.id}>
                        {cat.name} ({cat.subcategories?.length || 0} sub-categories)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Sub-category</label>
                  {(() => {
                    const allCats = getBaseCategories(formData);
                    const matched = allCats.find((c: any) => (c.slug || c.id) === productForm.category);
                    const subList: string[] = matched?.subcategories || [];

                    if (subList.length > 0) {
                      const isCustom = productForm.subcategory && !subList.includes(productForm.subcategory);
                      return (
                        <div className="space-y-1.5">
                          <select
                            value={isCustom ? "_custom" : (productForm.subcategory || subList[0])}
                            onChange={(e) => {
                              if (e.target.value !== "_custom") {
                                setProductForm({ ...productForm, subcategory: e.target.value });
                              }
                            }}
                            className="w-full px-3 py-2 border rounded-lg text-xs font-semibold text-slate-800 bg-white"
                          >
                            {subList.map((sub: string, sIdx: number) => (
                              <option key={sIdx} value={sub}>
                                {sub}
                              </option>
                            ))}
                            <option value="_custom">+ Type Custom Sub-category...</option>
                          </select>
                          {isCustom && (
                            <input
                              type="text"
                              value={productForm.subcategory || ""}
                              onChange={(e) =>
                                setProductForm({ ...productForm, subcategory: e.target.value })
                              }
                              placeholder="Type custom sub-category name..."
                              className="w-full px-3 py-1.5 border rounded-lg text-xs text-slate-700"
                            />
                          )}
                        </div>
                      );
                    }

                    return (
                      <input
                        type="text"
                        value={productForm.subcategory || ""}
                        onChange={(e) =>
                          setProductForm({ ...productForm, subcategory: e.target.value })
                        }
                        placeholder="e.g. Scalpels, Forceps, Scissors"
                        className="w-full px-3 py-2 border rounded-lg text-xs"
                      />
                    );
                  })()}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Pattern / Style</label>
                  <input
                    type="text"
                    value={productForm.pattern || ""}
                    onChange={(e) =>
                      setProductForm({ ...productForm, pattern: e.target.value })
                    }
                    placeholder="e.g. Angled, Fine Straight"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                {/* Available Sizes Table (Matches SS 1 Large View Page Tab) */}
                <div className="sm:col-span-2 space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <span>Available Sizes Table ({sizesTableList.length} Rows - Matches SS 1)</span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Configure the table rows shown under the &quot;Available Sizes&quot; tab on the Large View page (Article Number, Pattern, Cup Size, Length).
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSizesTableList([
                            ...sizesTableList,
                            {
                              article_number: productForm.code ? `${productForm.code}-${sizesTableList.length + 1}` : "",
                              pattern: productForm.pattern || "",
                              cup_size: "Standard",
                              length: productForm.length || "",
                            },
                          ]);
                        }}
                        className="px-3 py-1.5 bg-[#1B459B] hover:bg-[#13326f] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Size Row</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Add Presets: clicking immediately appends a size row */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 mr-1">Quick Add Row:</span>
                    {["2 mm", "4 mm", "6 mm", "11.5 cm", "13.5 cm", "14.5 cm", "16 cm", "18 cm", "20 cm", "21 cm", "28 cm"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleAddSizePreset(preset)}
                        className="px-2 py-0.5 bg-white hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold border border-slate-200 transition shadow-2xs cursor-pointer"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>

                  {sizesTableList.length === 0 ? (
                    <div className="text-center py-4 px-3 bg-white rounded-lg border border-dashed border-slate-300 text-slate-500 space-y-1">
                      <p className="text-xs font-semibold">No size table rows configured yet.</p>
                      <p className="text-[11px] text-slate-400">
                        Click &quot;+ Add Size Row&quot; or click a preset above to add rows for the Available Sizes table (Article Number, Pattern, Cup Size, Length).
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      <div className="hidden sm:grid sm:grid-cols-12 gap-2 text-[10px] font-black uppercase text-slate-500 tracking-wider px-1">
                        <span className="col-span-3">Article Number *</span>
                        <span className="col-span-3">Pattern</span>
                        <span className="col-span-3">Cup Size</span>
                        <span className="col-span-2">Length</span>
                        <span className="col-span-1 text-center">Action</span>
                      </div>
                      {sizesTableList.map((row, rIdx) => (
                        <div key={rIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2 bg-white rounded-lg border border-slate-200 items-center">
                          <div className="sm:col-span-3">
                            <span className="text-[10px] font-bold text-slate-400 sm:hidden block">Article Number:</span>
                            <input
                              type="text"
                              value={row.article_number || ""}
                              placeholder="e.g. SH-09"
                              onChange={(e) => {
                                const updated = [...sizesTableList];
                                updated[rIdx].article_number = e.target.value;
                                setSizesTableList(updated);
                              }}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-mono font-bold text-slate-800"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <span className="text-[10px] font-bold text-slate-400 sm:hidden block">Pattern:</span>
                            <input
                              type="text"
                              value={row.pattern || ""}
                              placeholder="e.g. Fine Straight"
                              onChange={(e) => {
                                const updated = [...sizesTableList];
                                updated[rIdx].pattern = e.target.value;
                                setSizesTableList(updated);
                              }}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <span className="text-[10px] font-bold text-slate-400 sm:hidden block">Cup Size:</span>
                            <input
                              type="text"
                              value={row.cup_size || ""}
                              placeholder="e.g. Standard, 2 mm"
                              onChange={(e) => {
                                const updated = [...sizesTableList];
                                updated[rIdx].cup_size = e.target.value;
                                setSizesTableList(updated);
                              }}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold text-slate-800"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-[10px] font-bold text-slate-400 sm:hidden block">Length:</span>
                            <input
                              type="text"
                              value={row.length || ""}
                              placeholder="e.g. 11.5 cm"
                              onChange={(e) => {
                                const updated = [...sizesTableList];
                                updated[rIdx].length = e.target.value;
                                setSizesTableList(updated);
                              }}
                              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800"
                            />
                          </div>
                          <div className="sm:col-span-1 flex justify-center">
                            <button
                              type="button"
                              onClick={() => setSizesTableList(sizesTableList.filter((_, i) => i !== rIdx))}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                              title="Remove Size Row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Live Visual Preview Pills derived directly from table */}
                  {(() => {
                    const derived = sizesTableList
                      .map((r) => {
                        if (r.cup_size && r.cup_size.trim() && r.cup_size.trim().toLowerCase() !== "standard") return r.cup_size.trim();
                        if (r.length && r.length.trim() && r.length.trim().toLowerCase() !== "standard") return r.length.trim();
                        return r.pattern?.trim() || "";
                      })
                      .filter(Boolean);
                    const uniquePills = Array.from(new Set(derived));
                    if (uniquePills.length === 0) return null;
                    return (
                      <div className="pt-2 border-t border-slate-200/80 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Preview of Size Pills on Large View Page ({uniquePills.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {uniquePills.map((sz, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-md bg-[#0F172A] text-white text-xs font-bold font-mono shadow-xs"
                            >
                              {sz}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Length</label>
                  <input
                    type="text"
                    value={productForm.length || ""}
                    onChange={(e) =>
                      setProductForm({ ...productForm, length: e.target.value })
                    }
                    placeholder="e.g. 28 cm, 11.5 cm"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Material</label>
                  <input
                    type="text"
                    value={productForm.material || ""}
                    onChange={(e) =>
                      setProductForm({ ...productForm, material: e.target.value })
                    }
                    placeholder="e.g. AISI 420 Surgical Stainless Steel"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    Product Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                    placeholder="e.g. Kerrison Rongeur 45° Up-Biting"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({ ...productForm, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2 p-3 bg-slate-50 rounded-lg border">
                  <label className="text-xs font-bold text-slate-700 flex justify-between">
                    <span>Main Product Image URL or Image Upload</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) =>
                        setProductForm({ ...productForm, image: e.target.value })
                      }
                      className="flex-1 px-3 py-1.5 border rounded-lg text-xs"
                    />
                    <label className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0">
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "productForm.image")}
                      />
                    </label>
                  </div>
                </div>

                {/* Additional Other Views / Gallery Images */}
                <div className="sm:col-span-2 space-y-2 p-3 bg-slate-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Other Views / Gallery Images ({productForm.gallery?.length || 0})
                    </label>
                    <label className="px-3 py-1 bg-[#1B459B] text-white rounded text-[11px] font-bold cursor-pointer hover:bg-blue-800 transition">
                      + Add Other View (Image Upload)
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "productForm.gallery")}
                      />
                    </label>
                  </div>

                  {productForm.gallery && productForm.gallery.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {productForm.gallery.map((imgUrl, gIdx) => (
                        <div key={gIdx} className="relative w-16 h-16 rounded-lg bg-white border p-1 shadow-xs group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgUrl} alt={`Other View ${gIdx + 1}`} className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => {
                              setProductForm((prev) => ({
                                ...prev,
                                gallery: (prev.gallery || []).filter((_, i) => i !== gIdx),
                              }));
                            }}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-xs hover:bg-red-700 cursor-pointer"
                            title="Remove"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic">No additional views added yet.</p>
                  )}
                </div>

                {/* Product Specifications Table Management */}
                <div className="sm:col-span-2 space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                        Product Specifications ({customSpecsList.length})
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Add, edit, or remove specifications displayed on the product Large View page.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCustomSpecsList([
                          ...customSpecsList,
                          { label: "", value: "" },
                        ])
                      }
                      className="px-3 py-1.5 bg-[#1B459B] hover:bg-[#13326f] text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add Spec</span>
                    </button>
                  </div>

                  {customSpecsList.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">No custom specs configured.</p>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {customSpecsList.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={spec.label}
                            onChange={(e) => {
                              const updated = [...customSpecsList];
                              updated[sIdx].label = e.target.value;
                              setCustomSpecsList(updated);
                            }}
                            placeholder="Label (e.g. Material, Finish)"
                            className="w-1/3 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                          />
                          <input
                            type="text"
                            value={spec.value}
                            onChange={(e) => {
                              const updated = [...customSpecsList];
                              updated[sIdx].value = e.target.value;
                              setCustomSpecsList(updated);
                            }}
                            placeholder="Value (e.g. AISI 420 Stainless Steel)"
                            className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setCustomSpecsList(customSpecsList.filter((_, i) => i !== sIdx))
                            }
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                            title="Remove Spec"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>



                <div className="flex items-center gap-2 pt-2 sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) =>
                        setProductForm({ ...productForm, isFeatured: e.target.checked })
                      }
                      className="w-4 h-4 text-[#ED1C24] rounded"
                    />
                    <span>Featured on Home Page</span>
                  </label>
                </div>
              </div>
            </form>

            {/* 3. FIXED MODAL STICKY FOOTER (ALWAYS VISIBLE, NEVER CUT OFF) */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                {editingProduct ? `SKU: ${productForm.code || ""}` : "New instrument will be saved to database"}
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="productModalForm"
                  disabled={productSaving}
                  className="px-7 py-2.5 bg-[#ED1C24] hover:bg-[#c9141b] text-white rounded-xl text-xs font-black tracking-wider uppercase transition shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{productSaving ? "Saving..." : (editingProduct ? "Save Changes" : "Save Product")}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
