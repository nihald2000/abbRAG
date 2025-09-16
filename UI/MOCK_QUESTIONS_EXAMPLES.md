# Mock Questions for AI Chatbot Testing

## Sample User Questions and Expected AI Responses

### 1. Error Analysis Questions

**User:** "What errors are in my logs?"
**Expected AI Response:**
```
Based on your uploaded logs, I've identified 15 errors with the following patterns:

**Most Common Errors:**
1. Connection Timeout: 8 occurrences
   - Pattern: Database connection fails after 30 seconds
   - Root Cause: Connection pool exhaustion
   - Recommendation: Increase connection pool size and add retry logic

2. Authentication Failed: 5 occurrences
   - Pattern: Invalid credentials during peak hours
   - Root Cause: Session timeout issues
   - Recommendation: Implement session refresh mechanism

**Error Distribution:**
- Time Range: 2024-01-15 10:00 to 2024-01-15 18:00
- Peak Hours: 14:00-16:00
- Affected Services: database-service, auth-service

**Immediate Actions:**
1. Check database connection pool configuration
2. Review authentication session settings
3. Monitor system resources during peak hours
```

**User:** "Why am I getting database connection errors?"
**Expected AI Response:**
```
**Database Connection Analysis:**

I found 8 database connection errors in your logs. Here's the breakdown:

**Error Pattern:**
- Error: "Connection timeout after 30 seconds"
- Frequency: 8 occurrences between 14:00-16:00
- Source: database-service

**Root Cause Analysis:**
1. **Connection Pool Exhaustion**: All available connections are in use
2. **High Load Period**: Errors occur during peak traffic hours
3. **Long-Running Queries**: Some queries are holding connections too long

**Immediate Solutions:**
1. Increase connection pool size from 10 to 25
2. Implement connection timeout retry logic
3. Add query timeout limits
4. Monitor connection pool metrics

**Long-term Recommendations:**
1. Implement connection pooling with HikariCP
2. Add database query optimization
3. Set up connection pool monitoring
4. Consider read replicas for heavy queries
```

### 2. Performance Analysis Questions

**User:** "Why is my system slow?"
**Expected AI Response:**
```
**Performance Analysis Results:**

**Key Metrics:**
- Average Response Time: 2.3 seconds (Target: <500ms)
- Peak Response Time: 8.7 seconds
- Throughput: 45 requests/second
- Error Rate: 12%

**Bottlenecks Identified:**
1. Database Queries: 1.8s average (78% of response time)
2. External API Calls: 0.4s average
3. Memory Usage: 85% of available memory

**Optimization Recommendations:**
1. Add database indexes on frequently queried columns
2. Implement query result caching
3. Optimize database connection pooling
4. Add memory monitoring and garbage collection tuning
5. Consider horizontal scaling for high-traffic endpoints
```

**User:** "Show me the slowest API endpoints"
**Expected AI Response:**
```
**Slowest API Endpoints Analysis:**

**Top 5 Slowest Endpoints:**
1. `/api/users/search` - 4.2s average
   - 156 requests
   - Issues: Missing database indexes, complex joins

2. `/api/reports/generate` - 3.8s average
   - 23 requests
   - Issues: Large dataset processing, no pagination

3. `/api/data/export` - 3.1s average
   - 12 requests
   - Issues: Synchronous processing, memory intensive

4. `/api/analytics/dashboard` - 2.9s average
   - 89 requests
   - Issues: Multiple database calls, no caching

5. `/api/files/upload` - 2.7s average
   - 67 requests
   - Issues: Large file processing, synchronous upload

**Optimization Priority:**
1. Add database indexes for search queries
2. Implement pagination for large datasets
3. Add caching for dashboard data
4. Move file processing to background jobs
```

### 3. Security Analysis Questions

**User:** "Are there any security issues in my logs?"
**Expected AI Response:**
```
**Security Analysis:**

**Threats Detected:**
- Brute Force Attacks: HIGH - 45 failed login attempts from 3 IPs
- Suspicious Activity: MEDIUM - Unusual API access patterns
- Data Access Anomalies: LOW - 2 unauthorized data access attempts

**Suspicious Activities:**
1. **Brute Force Attack**: IP 192.168.1.100 attempted 25 logins in 5 minutes
   - Time: 2024-01-15 15:30-15:35
   - Status: Blocked by rate limiting
   - Action: IP temporarily blocked

2. **Unusual API Access**: User ID 12345 accessed 200+ endpoints in 10 minutes
   - Time: 2024-01-15 16:45-16:55
   - Pattern: Rapid sequential API calls
   - Status: Under investigation

**Security Recommendations:**
1. Implement IP-based rate limiting
2. Add user behavior monitoring
3. Set up automated threat detection
4. Review and strengthen authentication mechanisms
5. Add data access logging and monitoring
```

### 4. Pattern Detection Questions

**User:** "What patterns do you see in my logs?"
**Expected AI Response:**
```
**Log Pattern Analysis:**

**Identified Patterns:**
1. **Temporal Patterns:**
   - Peak Activity: 14:00-16:00 (2x normal traffic)
   - Low Activity: 02:00-06:00 (0.3x normal traffic)
   - Cyclical Behavior: Daily traffic spikes at 9 AM and 2 PM

2. **Error Patterns:**
   - Error Clustering: Errors occur in 15-minute bursts
   - Error Propagation: Database errors trigger cascading failures
   - Recovery Patterns: System auto-recovers within 5-10 minutes

3. **Resource Usage Patterns:**
   - CPU Spikes: Every 30 minutes during peak hours
   - Memory Leaks: Gradual 2% increase per hour
   - Disk I/O Patterns: High write activity during backup windows

**Key Insights:**
- System is under stress during peak hours
- Error recovery mechanisms are working
- Memory management needs attention
- Backup processes impact performance
```

### 5. System Health Questions

**User:** "What's the overall health of my system?"
**Expected AI Response:**
```
**System Health Status: 🟡 WARNING**

**Overall Metrics:**
- System Uptime: 99.2% (Target: 99.9%)
- Error Rate: 3.2% (Target: <1%)
- Response Time: 1.8s average (Target: <500ms)
- Resource Usage: 78% (Target: <80%)

**Critical Issues:**
1. **High Error Rate**: 3.2% vs 1% target
   - Primary cause: Database connection timeouts
   - Impact: User experience degradation

2. **Memory Usage**: 78% of available memory
   - Trend: Increasing by 2% per hour
   - Risk: Potential out-of-memory errors

**Positive Indicators:**
✅ Error recovery mechanisms working
✅ No security breaches detected
✅ Backup processes completing successfully
✅ Monitoring systems operational

**Immediate Actions Required:**
1. Address database connection issues
2. Investigate memory leak
3. Scale resources for peak hours
4. Review error handling procedures
```

### 6. Specific Error Debugging

**User:** "Help me debug this error: 'Connection timeout after 30 seconds'"
**Expected AI Response:**
```
**Error Debugging: Connection Timeout**

**Error Context:**
- Error: "Connection timeout after 30 seconds"
- Source: database-service
- Frequency: 8 occurrences
- Time Range: 14:00-16:00

**Related Log Entries:**
```
14:15:23 [INFO] Attempting database connection
14:15:53 [ERROR] Connection timeout after 30 seconds
14:16:01 [WARN] Retrying database connection
14:16:31 [ERROR] Connection timeout after 30 seconds
```

**Root Cause Analysis:**
1. **Connection Pool Exhaustion**: All 10 connections are in use
2. **Long-Running Queries**: Some queries are holding connections for >30s
3. **Database Load**: High concurrent requests during peak hours

**Debugging Steps:**
1. Check current connection pool status
2. Identify long-running queries
3. Review database server metrics
4. Analyze concurrent request patterns

**Immediate Fixes:**
1. Increase connection pool size to 25
2. Add query timeout limits (10s)
3. Implement connection retry logic
4. Add connection pool monitoring

**Prevention:**
1. Set up connection pool alerts
2. Add query performance monitoring
3. Implement circuit breaker pattern
4. Regular database maintenance
```

### 7. File-Specific Questions

**User:** "Analyze the error.log file I just uploaded"
**Expected AI Response:**
```
**Error.log Analysis Complete!**

**File Summary:**
- File: error.log
- Size: 2.3 MB
- Log Entries: 1,247
- Time Range: 2024-01-15 00:00 - 2024-01-15 23:59

**Error Breakdown:**
- CRITICAL: 3 errors
- ERROR: 45 errors  
- WARNING: 156 errors
- INFO: 1,043 entries

**Top Error Types:**
1. Database Connection Failed (23 occurrences)
2. Authentication Timeout (12 occurrences)
3. Memory Allocation Error (8 occurrences)
4. File Not Found (7 occurrences)
5. Permission Denied (5 occurrences)

**Critical Issues Found:**
1. **Out of Memory**: 3 critical errors at 14:30, 15:45, 16:20
2. **Database Unavailable**: 2 critical errors at 15:15, 16:10
3. **System Overload**: 1 critical error at 17:30

**Recommendations:**
1. Investigate memory leaks immediately
2. Check database server health
3. Review system resource allocation
4. Implement better error handling
5. Add monitoring for critical thresholds
```

### 8. Time-Based Analysis

**User:** "What happened between 2 PM and 4 PM today?"
**Expected AI Response:**
```
**Time Range Analysis: 14:00-16:00**

**Key Events Timeline:**
```
14:00 - Normal system operation
14:15 - First database connection timeout
14:20 - Error rate starts increasing
14:30 - Memory usage hits 85%
14:45 - Peak error rate (12 errors/minute)
15:00 - System recovery begins
15:30 - Error rate drops to normal
16:00 - System fully recovered
```

**Critical Events:**
1. **14:15**: Database connection pool exhausted
2. **14:30**: Memory allocation failure (critical)
3. **14:45**: Peak error rate reached
4. **15:00**: Recovery process initiated
5. **15:30**: System stabilized

**Impact Assessment:**
- Affected Users: ~150 concurrent users
- Service Degradation: 45 minutes
- Data Loss: None detected
- Recovery Time: 30 minutes

**Root Cause:**
- High traffic load during peak hours
- Insufficient database connection pool
- Memory leak in application code
- Lack of proper resource monitoring

**Prevention Measures:**
1. Increase database connection pool
2. Fix memory leak in application
3. Add resource monitoring alerts
4. Implement auto-scaling for peak hours
```

---

**Note**: These are example responses that the AI chatbot should provide based on the instruction prompts. The actual responses will vary based on the specific log content and user queries.
