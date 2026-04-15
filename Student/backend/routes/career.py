"""
POST /career
Input:  { cgpa, skills, budget, country }
Output: { universities, courses, message }
"""
from flask import Blueprint, request, jsonify

career_bp = Blueprint("career", __name__)

# ─── Knowledge base ──────────────────────────────────────────────────────────

UNIVERSITIES = [
    {"name": "Massachusetts Institute of Technology", "country": "USA",       "min_cgpa": 9.0, "min_budget": 80000, "rank": 1,  "programs": ["Computer Science", "AI", "Robotics"]},
    {"name": "Stanford University",                   "country": "USA",       "min_cgpa": 8.8, "min_budget": 75000, "rank": 3,  "programs": ["Computer Science", "Data Science", "MBA"]},
    {"name": "Carnegie Mellon University",            "country": "USA",       "min_cgpa": 8.5, "min_budget": 70000, "rank": 7,  "programs": ["Computer Science", "AI", "HCI"]},
    {"name": "University of Toronto",                 "country": "Canada",    "min_cgpa": 7.5, "min_budget": 45000, "rank": 18, "programs": ["Computer Science", "Data Science", "Engineering"]},
    {"name": "Georgia Tech",                          "country": "USA",       "min_cgpa": 7.8, "min_budget": 50000, "rank": 33, "programs": ["Computer Science", "Data Science", "ML"]},
    {"name": "TU Munich",                             "country": "Germany",   "min_cgpa": 7.0, "min_budget": 25000, "rank": 50, "programs": ["AI", "Robotics", "Computer Science"]},
    {"name": "University of Edinburgh",               "country": "UK",        "min_cgpa": 7.5, "min_budget": 35000, "rank": 22, "programs": ["Computer Science", "Data Science", "AI"]},
    {"name": "University of Melbourne",               "country": "Australia", "min_cgpa": 7.2, "min_budget": 40000, "rank": 30, "programs": ["Computer Science", "Business", "Engineering"]},
    {"name": "NUS Singapore",                         "country": "Singapore", "min_cgpa": 8.0, "min_budget": 35000, "rank": 11, "programs": ["Computer Science", "Data Science", "Finance"]},
    {"name": "University of Waterloo",                "country": "Canada",    "min_cgpa": 7.8, "min_budget": 42000, "rank": 28, "programs": ["Computer Science", "AI", "Engineering"]},
    {"name": "ETH Zurich",                            "country": "Germany",   "min_cgpa": 8.2, "min_budget": 30000, "rank": 9,  "programs": ["Computer Science", "Data Science", "Robotics"]},
    {"name": "University of British Columbia",        "country": "Canada",    "min_cgpa": 7.3, "min_budget": 40000, "rank": 34, "programs": ["Computer Science", "Business", "Science"]},
]

COURSE_MAP = {
    "python":          ["Data Science MS", "Machine Learning", "AI Engineering", "Backend Development"],
    "ml":              ["Machine Learning MS", "Deep Learning", "AI Research", "Data Engineering"],
    "machine learning":["Machine Learning MS", "Deep Learning", "AI Research", "MLOps"],
    "data":            ["Data Science MS", "Data Engineering", "Business Analytics", "Big Data"],
    "java":            ["Software Engineering MS", "Enterprise Architecture", "Cloud Computing"],
    "finance":         ["Financial Engineering", "Quantitative Finance", "MBA Finance", "FinTech"],
    "business":        ["MBA", "Business Analytics", "Entrepreneurship", "Strategy Consulting"],
    "design":          ["HCI/UX MS", "Interaction Design", "Product Design", "Design Technology"],
    "research":        ["PhD Computer Science", "Research Fellowship", "AI Research", "Academic Track"],
    "cloud":           ["Cloud Computing MS", "DevOps Engineering", "Site Reliability", "AWS/Azure Specialization"],
}

DEFAULT_COURSES = ["Computer Science MS", "Information Technology MS", "Software Engineering", "Data Analytics"]


def score_university(uni, cgpa, budget, country, skills_lower):
    """
    Compute a fit score (0–100) for a university based on student profile.
    """
    if float(cgpa) < uni["min_cgpa"] or float(budget) < uni["min_budget"]:
        return None  # Hard cutoff

    score = 50  # Base score

    # Country match bonus
    if uni["country"].lower() == country.lower():
        score += 25

    # CGPA headroom (higher relative to minimum = better fit indication)
    cgpa_margin = float(cgpa) - uni["min_cgpa"]
    score += min(cgpa_margin * 5, 15)

    # Budget headroom
    budget_margin = (float(budget) - uni["min_budget"]) / uni["min_budget"]
    score += min(budget_margin * 10, 10)

    # Skill-program alignment
    for skill in skills_lower:
        for program in uni["programs"]:
            if skill in program.lower() or any(kw in program.lower() for kw in skill.split()):
                score += 5
                break

    return min(int(score), 99)


@career_bp.route("/career", methods=["POST"])
def career():
    data    = request.get_json()
    cgpa    = float(data.get("cgpa", 0))
    skills  = data.get("skills", "")
    budget  = float(data.get("budget", 0))
    country = data.get("country", "USA")

    skills_list  = [s.strip().lower() for s in skills.split(",") if s.strip()]
    skills_lower = skills_list

    # Score all universities
    scored = []
    for uni in UNIVERSITIES:
        fit = score_university(uni, cgpa, budget, country, skills_lower)
        if fit is not None:
            scored.append({**uni, "fit": fit})

    # Sort by fit score descending, return top 5
    scored.sort(key=lambda x: x["fit"], reverse=True)
    top_unis = scored[:5]

    # Map skills → recommended courses
    recommended_courses = []
    for skill in skills_lower:
        for key, courses in COURSE_MAP.items():
            if key in skill or skill in key:
                recommended_courses.extend(courses)
    recommended_courses = list(dict.fromkeys(recommended_courses))[:6]  # Unique, max 6
    if not recommended_courses:
        recommended_courses = DEFAULT_COURSES

    if not top_unis:
        message = (
            f"No universities matched with CGPA {cgpa} and budget ${budget:,.0f}. "
            "Consider increasing your budget or improving your CGPA."
        )
    else:
        message = (
            f"Based on your CGPA of {cgpa} and skills in {skills}, "
            f"we found {len(top_unis)} universities in {country} within your ${budget:,.0f} budget."
        )

    return jsonify({
        "universities": top_unis,
        "courses":      recommended_courses,
        "message":      message,
    })
