import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Stack,
  Grid,
  Paper,
  Divider,
  Chip,
  Fade,
  useTheme,
  alpha,
  keyframes,
  LinearProgress,
  Tab,
  Tabs,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useWallet } from '../hooks/useWallet';
import TeamIconImage from '../components/TeamIconImage';
import {
  TechCard,
  DataCard,
  TechPanel,
  GlowingBorder,
  TechButtonContainer,
  DataGrid,
  TechBackground,
  PulseContainer,
  ScanEffect,
  NeonText,
  DataIndicator
} from '../components/TechStyles';
import WashTradeCheck from '../components/WashTradeCheck';
import CombinedScoreDisplay from '../components/CombinedScoreDisplay';

interface CreditScoreResult {
  score: number;
  level: string;
  factors: {
    tokenStaking: number;
    aiScore: number;
    activity: number;
    governanceTokens: number;
  };
}

interface ScoringFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
  details?: string;
}

// 动画定义
const rotateGlow = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const scanEffect = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(100vh); }
  100% { transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const ScoreCircle = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: 200,
  height: 200,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: '50%',
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    animation: `${rotateGlow} 10s linear infinite`,
    opacity: 0.7,
    zIndex: -1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    background: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(5px)',
    zIndex: -1,
  },
}));

const FactorBar = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: 8,
  borderRadius: 4,
  overflow: 'hidden',
  background: alpha(theme.palette.background.paper, 0.2),
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: 4,
    transition: 'width 1s ease-in-out',
  }
}));

const CreditScore: React.FC = () => {
  const theme = useTheme();
  const { address, connectWallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreditScoreResult | null>(null);
  const [inputAddress, setInputAddress] = useState('');
  const [scanComplete, setScanComplete] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (address) {
      setInputAddress(address);
    }
  }, [address]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputAddress) {
      setError('请输入钱包地址');
      return;
    }
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(inputAddress)) {
      setError('请输入有效的以太坊钱包地址');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // 模拟API调用
    setTimeout(() => {
      try {
        // 生成随机评分数据
        const score = Math.floor(Math.random() * 30) + 70;
        let level = '';
        
        if (score >= 90) {
          level = '卓越';
        } else if (score >= 80) {
          level = '优秀';
        } else if (score >= 70) {
          level = '良好';
        } else {
          level = '一般';
        }
        
        const tokenStaking = Math.floor(Math.random() * 50) + 50;
        const aiScore = Math.floor(Math.random() * 50) + 50;
        const activity = Math.floor(Math.random() * 50) + 50;
        const governanceTokens = Math.floor(Math.random() * 50) + 50;
        
        setResult({
          score,
          level,
          factors: {
            tokenStaking,
            aiScore,
            activity,
            governanceTokens
          }
        });
        
        setLoading(false);
        setScanComplete(true);
      } catch (err) {
        setError('获取信用评分时出错');
        setLoading(false);
      }
    }, 2000);
  };
  
  // 获取评分等级对应的颜色
  const getLevelColor = (level: string) => {
    switch (level) {
      case '卓越': return theme.palette.success.main;
      case '优秀': return theme.palette.primary.main;
      case '良好': return theme.palette.secondary.main;
      case '一般': return theme.palette.warning.main;
      default: return theme.palette.primary.main;
    }
  };

  const scoringFactors: ScoringFactor[] = [
    {
      name: '还款记录',
      score: 92,
      weight: 0.35,
      description: '基于历史借款的还款情况评估',
      details: '您已成功按时还款4次，无逾期记录。按时还款对信用评分有显著正面影响。'
    },
    {
      name: '交易历史',
      score: 85,
      weight: 0.25,
      description: '基于历史交易数量、频率和金额评估',
    },
    {
      name: '钱包活跃度',
      score: 75,
      weight: 0.15,
      description: '基于钱包活跃时间和交互频率评估',
    },
    {
      name: '资产多样性',
      score: 65,
      weight: 0.1,
      description: '基于持有的代币种类和分布评估',
    },
    {
      name: '链上信誉',
      score: 90,
      weight: 0.15,
      description: '基于与已验证合约的互动和社区参与度评估',
    },
  ];

  return (
    <Box sx={{ 
      py: 8, 
      minHeight: 'calc(100vh - 64px)', 
      position: 'relative',
      background: `linear-gradient(135deg, ${alpha('#041209', 0.95)} 0%, ${alpha('#072116', 0.95)} 100%)`,
      overflow: 'hidden',
    }}>
      {/* 科技风格背景 */}
      <TechBackground />
      
      {/* 扫描线效果 */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: theme.palette.primary.main,
        boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 20px ${theme.palette.primary.main}`,
        animation: `${scanEffect} 3s linear infinite`,
        zIndex: 1,
      }} />
      
      <Container maxWidth="lg">
        <Fade in={true} timeout={800}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
              <PulseContainer>
                <TeamIconImage size={50} color="primary" sx={{ mr: 2 }} />
              </PulseContainer>
              <NeonText>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700, 
                    textAlign: 'center',
                    mb: 0,
                    color: '#fff',
                    textShadow: `0 0 10px ${theme.palette.primary.main}`,
                  }}
                >
                  区块链信用评分系统
                </Typography>
              </NeonText>
            </Box>
            
            <Grid container spacing={4} justifyContent="center">
              {/* 左侧：介绍和查询表单 */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={4}>
                  <DataCard>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TeamIconImage size={28} color="primary" sx={{ mr: 1 }} />
                        <NeonText>
                          <Typography variant="h5" component="h2" fontWeight="600" sx={{ color: '#fff' }}>
                            信用评分查询
                          </Typography>
                        </NeonText>
                      </Box>
                      
                      <ScanEffect>
                        <Typography variant="body1" paragraph sx={{ 
                          borderLeft: `2px solid ${theme.palette.primary.main}`,
                          pl: 2,
                          py: 1,
                          background: alpha(theme.palette.background.paper, 0.3),
                          color: '#fff',
                        }}>
                          我们的AI信用评分系统基于您的链上行为、资产持有和交互历史，为您提供全面的信用评估。
                        </Typography>
                      </ScanEffect>
                      
                      <Box sx={{ position: 'relative', mt: 3 }}>
                        <form onSubmit={handleSubmit}>
                          <TextField
                            fullWidth
                            label="输入钱包地址"
                            variant="outlined"
                            value={inputAddress}
                            onChange={(e) => setInputAddress(e.target.value)}
                            placeholder="0x..."
                            sx={{ 
                              mb: 3,
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                background: alpha(theme.palette.background.default, 0.5),
                                '&:hover': {
                                  boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.3)}`
                                },
                                '&.Mui-focused': {
                                  boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`
                                }
                              },
                              '& .MuiInputLabel-root': {
                                color: alpha(theme.palette.primary.main, 0.7)
                              },
                              '& .MuiInputBase-input': {
                                color: '#fff'
                              }
                            }}
                          />
                          
                          <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            type="submit"
                            disabled={loading}
                            sx={{ 
                              py: 1.5,
                              borderRadius: 2,
                              position: 'relative',
                              overflow: 'hidden',
                              background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                              '&:hover': {
                                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                                boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`
                              },
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.2)}, transparent)`,
                                animation: `${scanEffect} 1.5s linear infinite`,
                              }
                            }}
                          >
                            {loading ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : (
                              "查询信用评分"
                            )}
                          </Button>
                        </form>
                      </Box>
                      
                      {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                          {error}
                        </Alert>
                      )}
                    </CardContent>
                  </DataCard>
                  
                  <DataCard>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TeamIconImage size={28} color="secondary" sx={{ mr: 1 }} />
                        <NeonText>
                          <Typography variant="h5" component="h2" fontWeight="600" sx={{ color: '#fff' }}>
                            评分优势
                          </Typography>
                        </NeonText>
                      </Box>
                      
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12 }}>
                          <TechPanel>
                            <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#fff' }}>
                              去中心化信用
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#fff' }}>
                              基于链上数据的客观评估，无需中心化信用机构
                            </Typography>
                          </TechPanel>
                        </Grid>
                        
                        <Grid size={{ xs: 12 }}>
                          <TechPanel>
                            <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#fff' }}>
                              AI驱动分析
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#fff' }}>
                              先进AI算法分析您的链上行为模式和交易历史
                            </Typography>
                          </TechPanel>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </DataCard>
                </Stack>
              </Grid>
              
              {/* 右侧：评分结果 */}
              <Grid size={{ xs: 12, md: 8 }}>
                {scanComplete && result && (
                  <Fade in={scanComplete} timeout={1000}>
                    <Box>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs 
                          value={tabValue} 
                          onChange={(e, newValue) => setTabValue(newValue)}
                          centered
                          textColor="primary"
                          indicatorColor="primary"
                          sx={{
                            '& .MuiTab-root': {
                              color: 'text.secondary',
                              '&.Mui-selected': {
                                color: 'primary.main',
                              },
                            },
                          }}
                        >
                          <Tab label="基础信用评分" />
                          <Tab label="对敲交易检测" />
                          <Tab label="综合评分" />
                        </Tabs>
                      </Box>
                      
                      {tabValue === 0 && (
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12 }}>
                            <DataCard sx={{ height: '100%', minHeight: 500 }}>
                              <CardContent sx={{ p: 4 }}>
                                <Box sx={{ textAlign: 'center', mb: 4 }}>
                                  <Typography variant="h4" component="h2" fontWeight="700" sx={{ color: '#fff' }}>
                                    信用评分结果
                                  </Typography>
                                  <Typography variant="body1" sx={{ mt: 1, color: '#fff' }}>
                                    钱包地址: {inputAddress.substring(0, 6)}...{inputAddress.substring(inputAddress.length - 4)}
                                  </Typography>
                                </Box>
                                
                                <Box sx={{ mb: 6, position: 'relative' }}>
                                  <ScoreCircle>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography 
                                        variant="h2" 
                                        component="div" 
                                        sx={{ 
                                          fontWeight: 700,
                                          color: getLevelColor(result.level),
                                          textShadow: `0 0 10px ${getLevelColor(result.level)}`,
                                          lineHeight: 1,
                                        }}
                                      >
                                        {result.score}
                                      </Typography>
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          color: '#fff',
                                          opacity: 0.8,
                                          fontWeight: 500,
                                        }}
                                      >
                                        总分 / 100
                                      </Typography>
                                    </Box>
                                  </ScoreCircle>
                                  
                                  <GlowingBorder sx={{ display: 'inline-block', mt: 2, position: 'absolute', top: '50%', right: '10%' }}>
                                    <Box sx={{ 
                                      px: 3, 
                                      py: 1, 
                                      background: alpha(theme.palette.background.paper, 0.8),
                                      borderRadius: '6px',
                                    }}>
                                      <Typography 
                                        variant="h6" 
                                        sx={{ 
                                          fontWeight: 600,
                                          color: getLevelColor(result.level),
                                          textShadow: `0 0 5px ${getLevelColor(result.level)}`,
                                        }}
                                      >
                                        {result.level}
                                      </Typography>
                                    </Box>
                                  </GlowingBorder>
                                </Box>
                                
                                <Box sx={{ mb: 4 }}>
                                  <Typography variant="h5" component="h3" fontWeight="600" sx={{ mb: 3, color: '#fff' }}>
                                    评分因素分析
                                  </Typography>
                                  
                                  <Grid container spacing={3}>
                                    <Grid size={{ xs: 12 }}>
                                      <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body1" fontWeight="500" sx={{ color: '#fff' }}>
                                            还款记录
                                          </Typography>
                                          <Typography variant="body1" fontWeight="500" sx={{ color: theme.palette.success.main }}>
                                            92%
                                          </Typography>
                                        </Box>
                                        <FactorBar sx={{ 
                                          '&::after': { 
                                            width: '92%',
                                            background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                                          } 
                                        }} />
                                        <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                                          您已成功按时还款4次，无逾期记录。按时还款对信用评分有显著正面影响。
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    
                                    <Grid size={{ xs: 12 }}>
                                      <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body1" fontWeight="500" sx={{ color: '#fff' }}>
                                            代币质押量
                                          </Typography>
                                          <Typography variant="body1" fontWeight="500" sx={{ color: '#fff' }}>
                                            {result.factors.tokenStaking}%
                                          </Typography>
                                        </Box>
                                        <FactorBar sx={{ '&::after': { width: `${result.factors.tokenStaking}%` } }} />
                                      </Box>
                                    </Grid>
                                    
                                    <Grid size={{ xs: 12 }}>
                                      <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body1" fontWeight="500" sx={{ color: '#fff' }}>
                                            AI模型评分
                                          </Typography>
                                          <Typography variant="body1" fontWeight="500" sx={{ color: '#fff' }}>
                                            {result.factors.aiScore}%
                                          </Typography>
                                        </Box>
                                        <FactorBar sx={{ '&::after': { width: `${result.factors.aiScore}%` } }} />
                                      </Box>
                                    </Grid>
                                    
                                    <Grid size={{ xs: 12 }}>
                                      <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body1" fontWeight="500" sx={{ color: '#fff' }}>
                                            链上活跃度
                                          </Typography>
                                          <Typography variant="body1" fontWeight="500" sx={{ color: '#fff' }}>
                                            {result.factors.activity}%
                                          </Typography>
                                        </Box>
                                        <FactorBar sx={{ '&::after': { width: `${result.factors.activity}%` } }} />
                                      </Box>
                                    </Grid>
                                    
                                    <Grid size={{ xs: 12 }}>
                                      <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography variant="body1" fontWeight="500" sx={{ color: '#fff' }}>
                                            治理代币持有
                                          </Typography>
                                          <Typography variant="body1" fontWeight="500" sx={{ color: '#fff' }}>
                                            {result.factors.governanceTokens}%
                                          </Typography>
                                        </Box>
                                        <FactorBar sx={{ '&::after': { width: `${result.factors.governanceTokens}%` } }} />
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Box>
                                
                                <Divider sx={{ my: 4, borderColor: alpha(theme.palette.primary.main, 0.2) }} />
                                
                                <Box>
                                  <Typography variant="h5" component="h3" fontWeight="600" sx={{ mb: 3, color: '#fff' }}>
                                    评分建议
                                  </Typography>
                                  
                                  <TechPanel>
                                    <Typography variant="body1" sx={{ color: '#fff' }}>
                                      {result.score >= 90 ? 
                                        '您的信用评分卓越，可以获得最优惠的借贷利率和最高额度。' :
                                        result.score >= 80 ? 
                                        '您的信用评分优秀，可以获得较优惠的借贷条件，建议增加代币质押量以提升评分。' :
                                        result.score >= 70 ? 
                                        '您的信用评分良好，可以正常使用借贷服务，建议增加链上活跃度和治理参与度以提升评分。' :
                                        '您的信用评分一般，建议增加代币质押量和链上活跃度，参与更多DeFi活动以提升评分。'
                                      }
                                    </Typography>
                                  </TechPanel>
                                  
                                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                                    <Button
                                      variant="outlined"
                                      color="primary"
                                      sx={{ 
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1,
                                        borderWidth: 2,
                                        '&:hover': {
                                          borderWidth: 2,
                                          boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.5)}`
                                        }
                                      }}
                                      onClick={() => setResult(null)}
                                    >
                                      重新查询
                                    </Button>
                                  </Box>
                                </Box>
                              </CardContent>
                            </DataCard>
                          </Grid>
                        </Grid>
                      )}
                      
                      {tabValue === 1 && (
                        <WashTradeCheck 
                          address={inputAddress} 
                          originalScore={result ? result.score : 800}
                        />
                      )}
                      
                      {tabValue === 2 && (
                        <CombinedScoreDisplay 
                          address={inputAddress}
                          token="ETH"
                        />
                      )}
                    </Box>
                  </Fade>
                )}
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default CreditScore;
