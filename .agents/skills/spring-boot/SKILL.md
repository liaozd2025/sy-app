---
name: spring-boot
description: Spring Boot 4.x + MyBatis + Shiro development patterns for this RuoYi-based platform (颐享健康直播学习平台). Use when building features, writing controllers, services, mappers, or working with the project architecture.
metadata:
  version: "2.0.0"
  domain: backend
  triggers: Spring Boot, MyBatis, Shiro, Controller, Service, Mapper, RuoYi
  role: specialist
  scope: implementation
  output-format: code
---

# Spring Boot + MyBatis + Shiro Skill

Development patterns for this RuoYi-based platform (Spring Boot 4.0.3, Java 17).

> **领域提示**：本项目是「颐享健康直播学习平台」。SKILL 内的 `Distributor` / `distribution_*` 都是 **示例模板**，演示 Controller / Service / Mapper / Domain 四件套写法，**不代表本项目存在分销业务**。真实业务表见 `server/sql/init.sql`（live_session / health_content / quiz_question / course_chapter 等）。

## Core Workflow

1. **Analyze** — Understand requirements, identify affected modules
2. **Design** — Plan domain model, mapper SQL, service logic, controller endpoints
3. **Implement** — Follow the layered architecture: Domain → Mapper → Service → Controller → Template
4. **Test** — Write unit tests, verify with `mvn clean package`
5. **Verify** — Check Shiro permissions, pagination, error handling

## Project Patterns

### Controller (extends BaseController)
```java
@Controller
@RequestMapping("/distribution/distributor")
public class DistributorController extends BaseController {

    private String prefix = "distribution/distributor";

    @Autowired
    private IDistributorService distributorService;

    @RequiresPermissions("distribution:distributor:view")
    @GetMapping()
    public String view() {
        return prefix + "/distributor";
    }

    @RequiresPermissions("distribution:distributor:list")
    @PostMapping("/list")
    @ResponseBody
    public TableDataInfo list(Distributor distributor) {
        startPage();
        List<Distributor> list = distributorService.selectDistributorList(distributor);
        return getDataTable(list);
    }

    @Log(title = "分销员管理", businessType = BusinessType.INSERT)
    @RequiresPermissions("distribution:distributor:add")
    @PostMapping("/add")
    @ResponseBody
    public AjaxResult addSave(Distributor distributor) {
        return toAjax(distributorService.insertDistributor(distributor));
    }

    @Log(title = "分销员管理", businessType = BusinessType.UPDATE)
    @RequiresPermissions("distribution:distributor:edit")
    @PostMapping("/edit")
    @ResponseBody
    public AjaxResult editSave(Distributor distributor) {
        return toAjax(distributorService.updateDistributor(distributor));
    }

    @Log(title = "分销员管理", businessType = BusinessType.DELETE)
    @RequiresPermissions("distribution:distributor:remove")
    @PostMapping("/remove")
    @ResponseBody
    public AjaxResult remove(String ids) {
        return toAjax(distributorService.deleteDistributorByIds(ids));
    }
}
```

### Service Interface + Implementation
```java
public interface IDistributorService {
    List<Distributor> selectDistributorList(Distributor distributor);
    Distributor selectDistributorById(Long id);
    int insertDistributor(Distributor distributor);
    int updateDistributor(Distributor distributor);
    int deleteDistributorByIds(String ids);
}

@Service
public class DistributorServiceImpl implements IDistributorService {

    @Autowired
    private DistributorMapper distributorMapper;

    @Override
    public List<Distributor> selectDistributorList(Distributor distributor) {
        return distributorMapper.selectDistributorList(distributor);
    }

    @Override
    public int deleteDistributorByIds(String ids) {
        return distributorMapper.deleteDistributorByIds(Convert.toStrArray(ids));
    }
}
```

### Mapper (MyBatis)
```java
public interface DistributorMapper {
    List<Distributor> selectDistributorList(Distributor distributor);
    Distributor selectDistributorById(Long id);
    int insertDistributor(Distributor distributor);
    int updateDistributor(Distributor distributor);
    int deleteDistributorByIds(String[] ids);
}
```

### Mapper XML
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.dh.distribution.mapper.DistributorMapper">

    <resultMap type="Distributor" id="DistributorResult">
        <result property="id" column="id"/>
        <result property="name" column="name"/>
        <result property="phone" column="phone"/>
        <result property="status" column="status"/>
    </resultMap>

    <sql id="selectDistributorVo">
        select id, name, phone, status from distribution_distributor
    </sql>

    <select id="selectDistributorList" parameterType="Distributor" resultMap="DistributorResult">
        <include refid="selectDistributorVo"/>
        <where>
            <if test="name != null and name != ''">
                AND name like concat('%', #{name}, '%')
            </if>
            <if test="status != null and status != ''">
                AND status = #{status}
            </if>
        </where>
    </select>

    <insert id="insertDistributor" parameterType="Distributor" useGeneratedKeys="true" keyProperty="id">
        insert into distribution_distributor
        <trim prefix="(" suffix=")" suffixOverrides=",">
            <if test="name != null and name != ''">name,</if>
            <if test="phone != null and phone != ''">phone,</if>
            <if test="status != null and status != ''">status,</if>
        </trim>
        <trim prefix="values (" suffix=")" suffixOverrides=",">
            <if test="name != null and name != ''">#{name},</if>
            <if test="phone != null and phone != ''">#{phone},</if>
            <if test="status != null and status != ''">#{status},</if>
        </trim>
    </insert>
</mapper>
```

### Domain (extends BaseEntity)
```java
public class Distributor extends BaseEntity {
    private Long id;
    private String name;
    private String phone;
    private String status;

    // Manual getters and setters (no Lombok)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    // ...
}
```

## Constraints

### MUST DO
- Extend `BaseController` for all controllers
- Use `@RequiresPermissions` on every controller method
- Use `startPage()` before list queries for pagination
- Use `#{param}` in MyBatis XML (never `${param}` with user input)
- Return `AjaxResult` or `TableDataInfo` from `@ResponseBody` methods
- Use `Convert.toStrArray(ids)` for batch delete
- Add `@Log` annotation for write operations
- Manual getters/setters — no Lombok

### MUST NOT DO
- Field injection with `@Autowired` on fields (use constructor injection for new code, `@Autowired` field injection is acceptable for consistency with existing RuoYi code)
- Skip Shiro permission annotations
- Use `${}` in MyBatis XML for user-supplied values
- Return JPA entities or expose internal data directly
- Use Spring Security patterns — this project uses Shiro
