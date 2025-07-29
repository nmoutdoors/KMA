import * as React from 'react';
import { useState, useEffect } from 'react';
import styles from './AssessmentForm.module.scss';
import { IDisplayProperties } from './IKmaProps';

export interface IAssessmentLevel {
  value: string;
  score: number;
}

export interface IAssessmentQuestion {
  id: string;
  text: string;
  level: string;
  score: number;
}

export interface IAssessmentSection {
  id: string;
  title: string;
  questions: IAssessmentQuestion[];
  averageScore: number;
  backgroundColor: string;
}

export interface IAssessmentData {
  sections: IAssessmentSection[];
  organization: string;
}

export interface IAssessmentFormProps {
  onDataChange?: (data: IAssessmentData) => void;
  displayProperties?: IDisplayProperties;
  isFullscreen?: boolean;
}

const ASSESSMENT_LEVELS: IAssessmentLevel[] = [
  { value: 'Insufficient', score: 1 },
  { value: 'Beginning', score: 2 },
  { value: 'Developing', score: 3 },
  { value: 'Innovative', score: 4 },
  { value: 'Optimal', score: 5 }
];

const ORGANIZATIONS = [
  'OD1', 'OD2', 'OD3', 'OD4', 'OD5'
];

const AssessmentForm: React.FC<IAssessmentFormProps> = ({ onDataChange, displayProperties, isFullscreen }) => {
  const [selectedOrganization, setSelectedOrganization] = useState<string>('OD2');
  const [sections, setSections] = useState<IAssessmentSection[]>([]);
  const [overallScore, setOverallScore] = useState<number>(3);
  const [overallAverage, setOverallAverage] = useState<number>(3.33);

  // Generate dynamic styles based on display properties
  const getDynamicStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {};

    if (displayProperties) {
      baseStyles.fontFamily = displayProperties.primaryFontFamily;
      baseStyles.fontSize = `${displayProperties.baseFontSize}px`;
    }

    if (isFullscreen) {
      baseStyles.marginLeft = '50px';
      baseStyles.marginRight = '50px';
      baseStyles.maxWidth = 'calc(100vw - 140px)';
      baseStyles.overflowX = 'hidden';
      baseStyles.overflowY = 'auto';
    }

    return baseStyles;
  };

  const getTableStyles = (): React.CSSProperties => {
    return {};
  };

  const getColumnStyles = (columnType: string): React.CSSProperties => {
    return {};
  };



  const getTitleGradient = (): string => {
    if (!displayProperties) return 'linear-gradient(to bottom, #4a90e2 0%, #357abd 50%, #1e5f99 100%)';
    return `linear-gradient(to bottom, ${displayProperties.bannerColorLight} 0%, ${displayProperties.bannerColorMedium} 50%, ${displayProperties.bannerColorDark} 100%)`;
  };

  const getInstructionsGradient = (): string => {
    if (!displayProperties) return 'linear-gradient(to bottom, #1e5f99 0%, #357abd 50%, #4a90e2 100%)';
    return `linear-gradient(to bottom, ${displayProperties.bannerColorDark} 0%, ${displayProperties.bannerColorMedium} 50%, ${displayProperties.bannerColorLight} 100%)`;
  };

  // Helper function to get assessment level from score
  const getAssessmentLevelFromScore = (score: number): string => {
    if (score >= 4.5) return 'Optimal';
    if (score >= 3.5) return 'Innovative';
    if (score >= 2.5) return 'Developing';
    if (score >= 1.5) return 'Beginning';
    return 'Insufficient';
  };

  // Calculate overall scores helper function
  const calculateOverallScores = (sectionsData: IAssessmentSection[]): void => {
    const sectionAverages = sectionsData.map(section => section.averageScore);
    const totalAverage = sectionAverages.reduce((sum, avg) => sum + avg, 0) / sectionAverages.length;
    const flooredScore = Math.floor(totalAverage);

    setOverallAverage(Math.round(totalAverage * 100) / 100);
    setOverallScore(flooredScore);
  };

  // Initialize assessment data
  useEffect(() => {
    const initialSections: IAssessmentSection[] = [
      {
        id: 'strategy-governance',
        title: 'Strategy & Governance',
        backgroundColor: '#4a90e2',
        questions: [
          {
            id: 'vision-strategy-header',
            text: 'Vision and Strategy',
            level: 'Innovative',
            score: 4
          },
          {
            id: 'clearly-defined-vision',
            text: 'Does the organization have a clearly defined KM vision and strategy that aligns with its overall business objectives?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'strategy-communicated',
            text: 'Is the KM strategy communicated effectively throughout the organization?',
            level: 'Optimal',
            score: 5
          },
          {
            id: 'dedicated-lead',
            text: 'Is there a dedicated KM lead or team responsible for driving KM initiatives?',
            level: 'Optimal',
            score: 5
          },
          {
            id: 'leadership-support-header',
            text: 'Leadership Support',
            level: 'Optimal',
            score: 5
          },
          {
            id: 'senior-leaders-champion',
            text: 'To what extent do senior leaders actively champion and participate in KM efforts?',
            level: 'Optimal',
            score: 5
          },
          {
            id: 'initiatives-sponsored',
            text: 'Are KM initiatives sponsored and resourced appropriately?',
            level: 'Optimal',
            score: 5
          },
          {
            id: 'policies-procedures-header',
            text: 'Policies and Procedures',
            level: 'Optimal',
            score: 5
          },
          {
            id: 'established-policies',
            text: 'Are there established policies, guidelines, and procedures for knowledge sharing, capture, and reuse?',
            level: 'Optimal',
            score: 5
          },
          {
            id: 'policies-communicated',
            text: 'How well are these policies communicated and enforced?',
            level: 'Optimal',
            score: 5
          },
          {
            id: 'roles-responsibilities-header',
            text: 'Roles and Responsibilities',
            level: 'Optimal',
            score: 5
          },
          {
            id: 'roles-clearly-defined',
            text: 'Are roles and responsibilities for knowledge creation, sharing, and management clearly defined across different departments/teams?',
            level: 'Optimal',
            score: 5
          },
          {
            id: 'km-integrated-jobs',
            text: 'Is KM integrated into job descriptions and performance reviews?',
            level: 'Innovative',
            score: 4
          }
        ],
        averageScore: 4.71
      },
      {
        id: 'culture-people',
        title: 'Culture & People',
        backgroundColor: '#4a90e2',
        questions: [
          {
            id: 'knowledge-sharing-culture-header',
            text: 'Knowledge Sharing Culture',
            level: 'Developing',
            score: 3
          },
          {
            id: 'culture-openness',
            text: 'Is there a culture of openness, trust, and collaboration that encourages knowledge sharing?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'employees-rewarded',
            text: 'Are employees rewarded or recognized for sharing their knowledge?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'cultural-barriers',
            text: 'How well are cultural barriers to knowledge sharing (e.g., "hoarding" knowledge, fear of making mistakes) being mitigated?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'learning-development-header',
            text: 'Learning and Development',
            level: 'Beginning',
            score: 2
          },
          {
            id: 'organization-support',
            text: 'How well does the organization support continuous learning and skill development related to knowledge management?',
            level: 'Beginning',
            score: 2
          },
          {
            id: 'training-programs',
            text: 'Are training programs or resources available to help employees improve their KM skills?',
            level: 'Beginning',
            score: 2
          },
          {
            id: 'community-practice-header',
            text: 'Community of Practice (CoP) / Networks',
            level: 'Developing',
            score: 3
          },
          {
            id: 'foster-communities',
            text: 'Does the organization foster communities of practice or informal networks for knowledge exchange?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'active-effective',
            text: 'How active and effective are these communities?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'employee-engagement-header',
            text: 'Employee Engagement',
            level: 'Developing',
            score: 3
          },
          {
            id: 'employees-engaged',
            text: 'In your organization, how engaged are employees in KM initiatives?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'employees-understand',
            text: 'Do employees understand the value and benefits of effective KM?',
            level: 'Beginning',
            score: 2
          }
        ],
        averageScore: 2.63
      },
      {
        id: 'processes-content',
        title: 'Processes & Content',
        backgroundColor: '#4a90e2',
        questions: [
          {
            id: 'knowledge-capture-header',
            text: 'Knowledge Capture',
            level: 'Developing',
            score: 3
          },
          {
            id: 'capture-processes',
            text: 'Are processes are in place to capture explicit knowledge (e.g., documents, reports, best practices, lessons learned)?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'tacit-knowledge',
            text: 'Is tacit knowledge (e.g., expertise, insights, experiences) being identified and transferred?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'systematic-approach',
            text: 'Is there a systematic approach to capturing knowledge from projects, exit interviews, and critical incidents?',
            level: 'Innovative',
            score: 4
          },
          {
            id: 'knowledge-organization-storage-header',
            text: 'Knowledge Organization & Storage',
            level: 'Developing',
            score: 3
          },
          {
            id: 'knowledge-organized',
            text: 'Is knowledge organized, categorized, and tagged to facilitate easy retrieval?',
            level: 'Innovative',
            score: 4
          },
          {
            id: 'systems-repositories',
            text: 'Are specific systems or repositories identified to store knowledge?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'knowledge-accessible',
            text: 'Is the knowledge accessible to those who need it?',
            level: 'Beginning',
            score: 2
          },
          {
            id: 'knowledge-retrieval-reuse-header',
            text: 'Knowledge Retrieval & Reuse',
            level: 'Developing',
            score: 3
          },
          {
            id: 'processes-find-knowledge',
            text: 'Are processes in place to help employees find the information and knowledge they need?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'mechanisms-encourage-reuse',
            text: 'Are there mechanisms to encourage and track the reuse of existing knowledge?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'redundant-knowledge',
            text: 'Is redundant or outdated knowledge identified and archived/removed?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'content-quality-currency-header',
            text: 'Content Quality & Currency',
            level: 'Innovative',
            score: 4
          },
          {
            id: 'processes-ensure-accuracy',
            text: 'Are processes are in place to ensure the accuracy, relevance, and currency of knowledge content?',
            level: 'Innovative',
            score: 4
          },
          {
            id: 'processes-reviewing-updating',
            text: 'Is a process in place for reviewing and updating knowledge content?',
            level: 'Innovative',
            score: 4
          }
        ],
        averageScore: 3.33
      },
      {
        id: 'technology-infrastructure',
        title: 'Technology & Infrastructure',
        backgroundColor: '#4a90e2',
        questions: [
          {
            id: 'km-systems-tools-header',
            text: 'KM Systems/Tools',
            level: 'Insufficient',
            score: 1
          },
          {
            id: 'km-tech-available',
            text: 'Are all available technologies (e.g., DOD365, Teams, SharePoint, search engines, AI, platforms) used to support KM?',
            level: 'Insufficient',
            score: 1
          },
          {
            id: 'km-tools-integrated',
            text: 'Are these tools integrated and user-friendly?',
            level: 'Insufficient',
            score: 1
          },
          {
            id: 'km-user-needs',
            text: 'Do they meet the needs of the users?',
            level: 'Insufficient',
            score: 1
          },
          {
            id: 'accessibility-usability-header',
            text: 'Accessibility and Usability',
            level: 'Optimal',
            score: 5
          },
          {
            id: 'km-accessible',
            text: 'Are KM systems easily accessible from various devices and locations?',
            level: 'Optimal',
            score: 5
          },
          {
            id: 'user-interface',
            text: 'Is the user interface intuitive and conducive to effective KM?',
            level: 'Optimal',
            score: 5
          },
          {
            id: 'information-security-header',
            text: 'Information Security',
            level: 'Developing',
            score: 3
          },
          {
            id: 'sensitive-knowledge',
            text: 'Is the protection of sensitive knowledge an integral part of KM?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'access-controls',
            text: 'Are there appropriate access controls in place?',
            level: 'Developing',
            score: 3
          }
        ],
        averageScore: 3.44
      },
      {
        id: 'measurement-improvement',
        title: 'Measurement & Improvement',
        backgroundColor: '#4a90e2',
        questions: [
          {
            id: 'km-metrics-header',
            text: 'KM Metrics',
            level: 'Developing',
            score: 3
          },
          {
            id: 'measure-effectiveness',
            text: 'How well does the organization measure the effectiveness and impact of its KM initiatives?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'key-performance-indicators',
            text: 'Are key performance indicators (KPIs) used (e.g., knowledge reuse rates, search effectiveness, user satisfaction, cost savings, Innovation)?',
            level: 'Beginning',
            score: 2
          },
          {
            id: 'metrics-reviewed',
            text: 'Are these metrics regularly reviewed and reported?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'feedback-mechanisms-header',
            text: 'Feedback Mechanisms',
            level: 'Developing',
            score: 3
          },
          {
            id: 'mechanisms-gathering-feedback',
            text: 'Are there mechanisms for gathering feedback on KM practices and systems (e.g., surveys, user groups, suggestion boxes)?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'continuous-improvement-header',
            text: 'Continuous Improvement',
            level: 'Developing',
            score: 3
          },
          {
            id: 'use-feedback-metrics',
            text: 'Does the organization use feedback and metrics to continuously improve its KM practices?',
            level: 'Developing',
            score: 3
          },
          {
            id: 'process-identifying-gaps',
            text: 'Is there a process for identifying and addressing KM gaps and challenges?',
            level: 'Developing',
            score: 3
          }
        ],
        averageScore: 2.89
      },
      {
        id: 'return-on-investment',
        title: 'Return on Investment (ROI)',
        backgroundColor: '#4a90e2',
        questions: [
          {
            id: 'demonstrate-tangible-roi',
            text: 'Can the organization demonstrate a tangible return on investment from its KM efforts?',
            level: 'Developing',
            score: 3
          }
        ],
        averageScore: 3.00
      }
    ];

    setSections(initialSections);
    calculateOverallScores(initialSections);
  }, []);



  const handleQuestionChange = (sectionId: string, questionId: string, newLevel: string): void => {
    const levelObj = ASSESSMENT_LEVELS.filter((level: IAssessmentLevel) => level.value === newLevel)[0];
    const newScore = levelObj ? levelObj.score : 1;

    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        const updatedQuestions = section.questions.map(question => {
          if (question.id === questionId) {
            return { ...question, level: newLevel, score: newScore };
          }
          return question;
        });

        // Calculate section average excluding subsection headers (questions ending with '-header')
        const actualQuestions = updatedQuestions.filter(q => q.id.indexOf('-header') === -1);
        const sectionAverage = actualQuestions.length > 0
          ? actualQuestions.reduce((sum, q) => sum + q.score, 0) / actualQuestions.length
          : 0;

        return {
          ...section,
          questions: updatedQuestions,
          averageScore: Math.round(sectionAverage * 100) / 100
        };
      }
      return section;
    });

    setSections(updatedSections);
    calculateOverallScores(updatedSections);

    if (onDataChange) {
      onDataChange({ sections: updatedSections, organization: selectedOrganization });
    }
  };

  return (
    <div className={styles.assessmentForm} style={getDynamicStyles()}>
      <table className={styles.assessmentTable} style={getTableStyles()}>
        {/* Header Row 1: Title and Organization */}
        <thead>
          <tr className={styles.headerRow1}>
            <td
              className={styles.titleCell}
              colSpan={3}
              style={{ background: getTitleGradient() }}
            >
              <div className={styles.titleContent}>
                <div
                  className={styles.title}
                  style={{ fontSize: displayProperties?.titleFontSize ? `${displayProperties.titleFontSize}px` : undefined }}
                >
                  Knowledge Management
                </div>
                <div className={styles.subtitle}>Maturity Assessment</div>
              </div>
            </td>
            <td
              className={styles.orgHeaderCell}
              style={{ backgroundColor: displayProperties?.organizationColorPrimary || '#4EA72E' }}
            >
              <div className={styles.orgLabel}>Assessed</div>
              <div className={styles.orgLabel}>Organization</div>
            </td>
            <td className={styles.overallAverageHeaderCell}>
              <div className={styles.overallLabel}>Overall</div>
              <div className={styles.overallLabel}>Average</div>
            </td>
          </tr>

          {/* Header Row 2: Overall Score and Organization Dropdown */}
          <tr className={styles.headerRow2}>
            <td className={styles.overallScoreCell} colSpan={3}>
              <span className={styles.overallScoreLabel}>Overall Assessment Score</span>
            </td>
            <td className={styles.orgDropdownCell}>
              <select
                className={styles.orgDropdown}
                value={selectedOrganization}
                onChange={(e) => setSelectedOrganization(e.target.value)}
              >
                {ORGANIZATIONS.map(org => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>
            </td>
            <td className={styles.overallAverageCell}>
              {overallAverage}
            </td>
          </tr>

          {/* Header Row 3: Instructions and Score */}
          <tr className={styles.headerRow3}>
            <td
              className={styles.instructionsCell}
              colSpan={3}
              style={{ background: getInstructionsGradient() }}
            >
              Click on the cells inside the green borders to select your responses from the dropdown list. Your scores will automatically recalculate.
            </td>
            <td className={styles.overallScoreValueCell}>
              <div className={styles.overallScoreValue}>{overallScore}</div>
              <div className={styles.overallScoreLabel2}>Developing</div>
            </td>
            <td className={styles.overallAverageValueCell}>
              {/* Empty cell to maintain layout */}
            </td>
          </tr>

          {/* Column Headers */}
          <tr className={styles.columnHeaders}>
            <th className={styles.questionHeader}>Question</th>
            <th className={styles.levelHeader}>Assessment Level</th>
            <th className={styles.scoreHeader}>Question Score</th>
            <th className={styles.avgHeader}>Average</th>
            <th className={styles.sectionHeader}>Section Score</th>
          </tr>
        </thead>

        <tbody>
          {sections.map(section => (
            <React.Fragment key={section.id}>
              {/* Main Section Header Row */}
              <tr className={styles.sectionHeaderRow} style={{ backgroundColor: section.backgroundColor }}>
                <td className={styles.sectionTitleCell} style={getColumnStyles('question')}>{section.title}</td>
                <td className={styles.sectionLevelCell} style={getColumnStyles('level')}>
                  {getAssessmentLevelFromScore(section.averageScore)}
                </td>
                <td className={styles.sectionScoreCell} style={getColumnStyles('score')} />
                <td className={styles.sectionAverageCell} style={getColumnStyles('average')}>{section.averageScore}</td>
                <td className={styles.sectionFinalScoreCell} style={getColumnStyles('section')}>{Math.round(section.averageScore)}</td>
              </tr>

              {/* Section Questions */}
              {section.questions.map((question, index) => {
                // Check if this is a subsection header (ends with '-header')
                const isSubsectionHeader = question.id.indexOf('-header') !== -1;

                if (isSubsectionHeader) {
                  // Calculate subsection average for questions that follow this header
                  let nextHeaderIndex = -1;
                  for (let i = index + 1; i < section.questions.length; i++) {
                    if (section.questions[i].id.indexOf('-header') !== -1) {
                      nextHeaderIndex = i;
                      break;
                    }
                  }
                  const endIndex = nextHeaderIndex === -1 ? section.questions.length : nextHeaderIndex;
                  const subsectionQuestions = section.questions.slice(index + 1, endIndex);
                  const subsectionAverage = subsectionQuestions.length > 0
                    ? subsectionQuestions.reduce((sum, q) => sum + q.score, 0) / subsectionQuestions.length
                    : 0;
                  const roundedSubsectionAverage = Math.round(subsectionAverage * 100) / 100;

                  return (
                    <tr
                      key={question.id}
                      className={styles.subsectionHeaderRow}
                      style={{ backgroundColor: displayProperties?.subheadingBackgroundColor || '#f0f8ff' }}
                    >
                      <td className={styles.subsectionTitleCell} style={getColumnStyles('question')}>{question.text}</td>
                      <td className={styles.subsectionLevelCell} style={getColumnStyles('level')}>
                        {getAssessmentLevelFromScore(subsectionAverage)}
                      </td>
                      <td className={styles.subsectionScoreCell} style={getColumnStyles('score')} />
                      <td className={styles.subsectionAverageCell} style={getColumnStyles('average')}>{roundedSubsectionAverage}</td>
                      <td className={styles.subsectionFinalScoreCell} style={getColumnStyles('section')}>{Math.round(subsectionAverage)}</td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={question.id} className={styles.questionRow}>
                      <td className={styles.questionTextCell} style={getColumnStyles('question')}>{question.text}</td>
                      <td className={styles.questionLevelCell} style={getColumnStyles('level')}>
                        <select
                          value={question.level}
                          onChange={(e) => handleQuestionChange(section.id, question.id, e.target.value)}
                          className={styles.levelDropdown}
                          style={isFullscreen ? { width: '100%', maxWidth: '100%', fontSize: '12px' } : {}}
                        >
                          {ASSESSMENT_LEVELS.map(level => (
                            <option key={level.value} value={level.value}>
                              {level.value}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className={styles.questionScoreCell} style={getColumnStyles('score')}>{question.score}</td>
                      <td className={styles.questionAverageCell} style={getColumnStyles('average')} />
                      <td className={styles.questionSectionScoreCell} style={getColumnStyles('section')} />
                    </tr>
                  );
                }
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssessmentForm;
